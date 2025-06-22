import { config } from 'dotenv';
config();

// Import the Manager Agent (main entry point)
import '@/ai/flows/main-query-flow';

// Import the Sub-Agent implementations
import '@/ai/agents/planning-agent';
import '@/ai/agents/sourcing-agent';
import '@/ai/agents/delivery-agent';
