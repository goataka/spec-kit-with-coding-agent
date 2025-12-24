import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class SpecKitDevStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table for clock-in/clock-out records
    const clockTable = new dynamodb.Table(this, 'ClockTable', {
      tableName: 'spec-kit-dev-clock',
      partitionKey: {
        name: 'userId',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'timestamp',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    // Add tags to the clock table
    cdk.Tags.of(clockTable).add('Environment', 'development');
    cdk.Tags.of(clockTable).add('Project', 'spec-kit-attendance');

    // Add GSI for querying by date
    clockTable.addGlobalSecondaryIndex({
      indexName: 'DateIndex',
      partitionKey: {
        name: 'date',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'timestamp',
        type: dynamodb.AttributeType.STRING,
      },
    });

    // Outputs
    new cdk.CfnOutput(this, 'ClockTableName', {
      value: clockTable.tableName,
      description: 'Name of the DynamoDB clock table',
      exportName: 'SpecKitDevClockTableName',
    });

    new cdk.CfnOutput(this, 'ClockTableArn', {
      value: clockTable.tableArn,
      description: 'ARN of the DynamoDB clock table',
      exportName: 'SpecKitDevClockTableArn',
    });
  }
}
