#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AttendanceKitStack } from '../lib/attendance-kit-stack';

const app = new cdk.App();

// Get environment parameter from context or environment variable
const environment = app.node.tryGetContext('environment') || process.env.ENVIRONMENT || 'dev';

// Validate environment
const validEnvironments = ['dev', 'staging'];
if (!validEnvironments.includes(environment)) {
  throw new Error(`Invalid environment: ${environment}. Must be one of: ${validEnvironments.join(', ')}`);
}

// AWS environment configuration
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'ap-northeast-1',
};

// GitHub repository (can be overridden via context)
const githubRepository = app.node.tryGetContext('githubRepository') || 'goataka/attendance-kit';

// Create stack with environment-specific name
const stackName = `AttendanceKit-${environment.charAt(0).toUpperCase() + environment.slice(1)}-Stack`;

new AttendanceKitStack(app, stackName, {
  env,
  environment,
  githubRepository,
  description: `DynamoDB clock table for attendance-kit (${environment} environment)`,
  tags: {
    Environment: environment,
    Project: 'attendance-kit',
    ManagedBy: 'CDK',
    CostCenter: 'Engineering',
  },
});

app.synth();
