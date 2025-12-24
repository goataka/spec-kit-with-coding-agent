import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class SpecKitDevStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table for attendance management system
    const attendanceTable = new dynamodb.Table(this, 'AttendanceTable', {
      tableName: 'spec-kit-dev-attendance',
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

    // Add tags to the attendance table
    cdk.Tags.of(attendanceTable).add('Environment', 'development');
    cdk.Tags.of(attendanceTable).add('Project', 'spec-kit-attendance');

    // Add GSI for querying by date
    attendanceTable.addGlobalSecondaryIndex({
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

    // DynamoDB table for leave requests
    const leaveRequestTable = new dynamodb.Table(this, 'LeaveRequestTable', {
      tableName: 'spec-kit-dev-leave-requests',
      partitionKey: {
        name: 'requestId',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'userId',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    // Add tags to the leave request table
    cdk.Tags.of(leaveRequestTable).add('Environment', 'development');
    cdk.Tags.of(leaveRequestTable).add('Project', 'spec-kit-attendance');

    // Add GSI for querying by user
    leaveRequestTable.addGlobalSecondaryIndex({
      indexName: 'UserIndex',
      partitionKey: {
        name: 'userId',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'status',
        type: dynamodb.AttributeType.STRING,
      },
    });

    // Outputs
    new cdk.CfnOutput(this, 'AttendanceTableName', {
      value: attendanceTable.tableName,
      description: 'Name of the DynamoDB attendance table',
      exportName: 'SpecKitDevAttendanceTableName',
    });

    new cdk.CfnOutput(this, 'AttendanceTableArn', {
      value: attendanceTable.tableArn,
      description: 'ARN of the DynamoDB attendance table',
      exportName: 'SpecKitDevAttendanceTableArn',
    });

    new cdk.CfnOutput(this, 'LeaveRequestTableName', {
      value: leaveRequestTable.tableName,
      description: 'Name of the DynamoDB leave request table',
      exportName: 'SpecKitDevLeaveRequestTableName',
    });

    new cdk.CfnOutput(this, 'LeaveRequestTableArn', {
      value: leaveRequestTable.tableArn,
      description: 'ARN of the DynamoDB leave request table',
      exportName: 'SpecKitDevLeaveRequestTableArn',
    });
  }
}
