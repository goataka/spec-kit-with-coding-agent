import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';

export interface AttendanceKitStackProps extends cdk.StackProps {
  environment: string; // 'dev' | 'staging'
  githubRepository: string; // GitHub repository name for OIDC
}

export class AttendanceKitStack extends cdk.Stack {
  public readonly clockTable: dynamodb.Table;
  public readonly githubActionsRole: iam.Role;
  public readonly githubProvider: iam.OpenIdConnectProvider;

  constructor(scope: Construct, id: string, props: AttendanceKitStackProps) {
    super(scope, id, props);

    const { environment, githubRepository } = props;

    // OIDC Provider for GitHub Actions
    this.githubProvider = new iam.OpenIdConnectProvider(this, 'GitHubProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
      thumbprints: ['6938fd4d98bab03faadb97b34396831e3780aea1'],
    });

    // IAM Role for GitHub Actions with OIDC
    this.githubActionsRole = new iam.Role(this, 'GitHubActionsRole', {
      assumedBy: new iam.FederatedPrincipal(
        this.githubProvider.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': `repo:${githubRepository}:*`,
          },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
      description: `Role for GitHub Actions to deploy infrastructure (${environment})`,
      roleName: `GitHubActionsDeployRole-${environment}`,
      maxSessionDuration: cdk.Duration.hours(1),
    });

    // Attach PowerUserAccess for deployment permissions
    // NOTE: For production, this should be replaced with more restrictive permissions
    this.githubActionsRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('PowerUserAccess')
    );
    
    // Additional IAM permissions for CDK operations
    // Security requirement: Scope resources to specific patterns, avoid wildcards
    this.githubActionsRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'iam:CreateRole',
        'iam:DeleteRole',
        'iam:AttachRolePolicy',
        'iam:DetachRolePolicy',
        'iam:PutRolePolicy',
        'iam:DeleteRolePolicy',
        'iam:GetRole',
        'iam:GetRolePolicy',
        'iam:ListRolePolicies',
        'iam:ListAttachedRolePolicies',
        'iam:PassRole',
        'iam:TagRole',
        'iam:UntagRole',
        'iam:CreateOpenIDConnectProvider',
        'iam:DeleteOpenIDConnectProvider',
        'iam:GetOpenIDConnectProvider',
        'iam:TagOpenIDConnectProvider',
        'iam:UntagOpenIDConnectProvider',
      ],
      resources: [
        `arn:aws:iam::${this.account}:role/cdk-*`,
        `arn:aws:iam::${this.account}:role/GitHubActionsDeployRole-${environment}`,
        `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`,
      ],
    }));

    // DynamoDB Clock Table
    this.clockTable = new dynamodb.Table(this, 'ClockTable', {
      tableName: `attendance-kit-${environment}-clock`,
      partitionKey: {
        name: 'userId',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'timestamp',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      // Cost optimization: No additional alarms or monitoring features
    });

    // Global Secondary Index: DateIndex
    this.clockTable.addGlobalSecondaryIndex({
      indexName: 'DateIndex',
      partitionKey: {
        name: 'date',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'timestamp',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Cost monitoring tags
    cdk.Tags.of(this.clockTable).add('Environment', environment);
    cdk.Tags.of(this.clockTable).add('Project', 'attendance-kit');
    cdk.Tags.of(this.clockTable).add('ManagedBy', 'CDK');
    cdk.Tags.of(this.clockTable).add('CostCenter', 'Engineering');

    // CloudFormation Outputs
    new cdk.CfnOutput(this, 'TableName', {
      value: this.clockTable.tableName,
      description: `DynamoDB clock table name (${environment})`,
      exportName: `AttendanceKit-${environment.charAt(0).toUpperCase() + environment.slice(1)}-ClockTableName`,
    });

    new cdk.CfnOutput(this, 'TableArn', {
      value: this.clockTable.tableArn,
      description: `DynamoDB clock table ARN (${environment})`,
      exportName: `AttendanceKit-${environment.charAt(0).toUpperCase() + environment.slice(1)}-ClockTableArn`,
    });

    new cdk.CfnOutput(this, 'GSIName', {
      value: 'DateIndex',
      description: `Global Secondary Index name (${environment})`,
      exportName: `AttendanceKit-${environment.charAt(0).toUpperCase() + environment.slice(1)}-GSIName`,
    });

    new cdk.CfnOutput(this, 'Environment', {
      value: environment,
      description: 'Deployment environment',
      exportName: `AttendanceKit-${environment.charAt(0).toUpperCase() + environment.slice(1)}-Environment`,
    });

    new cdk.CfnOutput(this, 'GitHubActionsRoleArn', {
      value: this.githubActionsRole.roleArn,
      description: `IAM Role ARN for GitHub Actions (${environment})`,
      exportName: `AttendanceKit-${environment.charAt(0).toUpperCase() + environment.slice(1)}-GitHubActionsRoleArn`,
    });

    new cdk.CfnOutput(this, 'OIDCProviderArn', {
      value: this.githubProvider.openIdConnectProviderArn,
      description: `OIDC Provider ARN for GitHub Actions (${environment})`,
      exportName: `AttendanceKit-${environment.charAt(0).toUpperCase() + environment.slice(1)}-OIDCProviderArn`,
    });
  }
}
