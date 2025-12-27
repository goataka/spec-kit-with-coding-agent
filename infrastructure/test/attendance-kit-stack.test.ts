import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AttendanceKitStack } from '../lib/attendance-kit-stack';

describe('AttendanceKitStack', () => {
  let app: App;
  let template: Template;

  beforeEach(() => {
    app = new App();
    const stack = new AttendanceKitStack(app, 'TestStack', {
      environment: 'dev',
      githubRepository: 'goataka/attendance-kit',
    });
    template = Template.fromStack(stack);
  });

  test('DynamoDB Table Created', () => {
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: 'attendance-kit-dev-clock',
      BillingMode: 'PAY_PER_REQUEST',
      PointInTimeRecoverySpecification: {
        PointInTimeRecoveryEnabled: true,
      },
    });
  });

  test('Table has correct Partition Key', () => {
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      KeySchema: [
        {
          AttributeName: 'userId',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'timestamp',
          KeyType: 'RANGE',
        },
      ],
    });
  });

  test('Table has correct Attribute Definitions', () => {
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      AttributeDefinitions: [
        {
          AttributeName: 'userId',
          AttributeType: 'S',
        },
        {
          AttributeName: 'timestamp',
          AttributeType: 'S',
        },
        {
          AttributeName: 'date',
          AttributeType: 'S',
        },
      ],
    });
  });

  test('Global Secondary Index Created', () => {
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      GlobalSecondaryIndexes: [
        {
          IndexName: 'DateIndex',
          KeySchema: [
            {
              AttributeName: 'date',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'timestamp',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
    });
  });

  test('Table has RETAIN deletion policy', () => {
    template.hasResource('AWS::DynamoDB::Table', {
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain',
    });
  });

  test('Table name includes environment', () => {
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: 'attendance-kit-dev-clock',
    });
  });

  test('OIDC Provider Created', () => {
    template.resourceCountIs('Custom::AWSCDKOpenIdConnectProvider', 1);
  });

  test('GitHub Actions IAM Role Created', () => {
    template.hasResourceProperties('AWS::IAM::Role', {
      RoleName: 'GitHubActionsDeployRole-dev',
    });
  });

  test('IAM Role has PowerUserAccess policy', () => {
    template.hasResourceProperties('AWS::IAM::Role', {
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/PowerUserAccess',
            ],
          ],
        },
      ],
    });
  });

  test('Stack outputs include TableName', () => {
    const outputs = template.findOutputs('TableName');
    expect(outputs).toBeDefined();
    expect(Object.keys(outputs).length).toBe(1);
  });

  test('Stack outputs include TableArn', () => {
    const outputs = template.findOutputs('TableArn');
    expect(outputs).toBeDefined();
    expect(Object.keys(outputs).length).toBe(1);
  });

  test('Stack outputs include GitHubActionsRoleArn', () => {
    const outputs = template.findOutputs('GitHubActionsRoleArn');
    expect(outputs).toBeDefined();
    expect(Object.keys(outputs).length).toBe(1);
  });

  test('Stack outputs include OIDCProviderArn', () => {
    const outputs = template.findOutputs('OIDCProviderArn');
    expect(outputs).toBeDefined();
    expect(Object.keys(outputs).length).toBe(1);
  });
});

describe('AttendanceKitStack - Staging Environment', () => {
  test('Staging environment creates correct table name', () => {
    const app = new App();
    const stack = new AttendanceKitStack(app, 'TestStackStaging', {
      environment: 'staging',
      githubRepository: 'goataka/attendance-kit',
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: 'attendance-kit-staging-clock',
    });
  });
});
