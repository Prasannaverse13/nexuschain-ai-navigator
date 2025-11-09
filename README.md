
# NexusChain AI Navigator

NexusChain AI Navigator is an innovative serverless multi-agent AI system deployed on Google Cloud Run, designed to revolutionize supply chain analytics. It serves as a "Unified Supply Chain Brain," leveraging Google's Agent Development Kit (ADK) to orchestrate specialized AI agents that break down complex supply chain queries into actionable insights.

## Project Overview

This project is built using a modern, cloud-native stack:
- **Frontend**: Next.js, React, and Tailwind CSS for a responsive and intuitive user interface
- **Backend**: Serverless architecture powered by Google Cloud Run
- **AI Engine**: Google's Agent Development Kit (ADK) and Genkit for sophisticated multi-agent orchestration
- **Infrastructure**: Fully integrated with Google Cloud services including BigQuery, Cloud Storage, and GPU computing

### Cloud Run Implementation
Our application is deployed as a serverless solution on Google Cloud Run, providing scalability and reliability:

- **API Services**: `/src/app/api/*` - RESTful endpoints deployed as Cloud Run services
- **Agent Workers**: `/src/ai/agents/*` - Each agent runs as a separate Cloud Run job
- **Main Orchestrator**: `/src/ai/flows/main-query-flow.ts` - Deployed as a Cloud Run service
- **Region**: europe-west4 for GPU workloads using NVIDIA L4 GPUs

### Why Google Cloud Run?
- **Scalability**: Automatic scaling based on demand
- **Cost-effectiveness**: Pay only for actual compute time
- **GPU Support**: Access to NVIDIA L4 GPUs for ML model inference
- **Zero Maintenance**: Fully managed infrastructure

## How NexusChain AI Navigator Works

The application follows a sophisticated orchestration pattern powered by a multi-agent backend. Here's a breakdown of the end-to-end process, from user query to final report.

1.  **User Initiates Query**: The user enters a high-level supply chain goal into the frontend (e.g., "Analyze the sourcing challenges for lithium batteries").

2.  **Manager Agent Invocation**: The frontend calls the `mainQuery` flow located in `src/ai/flows/main-query-flow.ts`. This flow acts as the entry point to the **Manager Agent**, which is the central orchestrator of the system.

3.  **AI-Powered Planning & Tool Selection**: The Manager Agent is not just a simple script; it's a powerful AI prompt given a complex goal and a set of **tools**. Each specialist agent (Sourcing, Manufacturing, etc.) is defined as a tool that the Manager can choose to use. The Manager Agent analyzes the user's query and autonomously decides:
    *   **What is the plan?** It breaks down the high-level goal into smaller, logical steps.
    *   **Which agents are needed?** It determines which specialist agents (tools) are required to execute the plan.
    *   **In what order?** It calls the agents in a sequence that makes sense. For a query on "sourcing challenges," it would naturally call the `sourcingAgent` tool first.

4.  **Sequential Task Delegation & Execution**: The Manager Agent executes its plan by calling the selected agent tools one by one.
    *   The `sourcingAgent` is called to research suppliers and pricing.
    *   The `manufacturingAgent` is called to investigate production complexities.
    *   This continues for all relevant agents, each performing its focused analysis and returning its findings.

5.  **Synthesis and Final Report Generation**: As the specialist agents return their findings, the information is collected by the Manager Agent. Once its plan is complete, its final instruction is to synthesize all the gathered data into a single, structured report, adhering to a predefined JSON schema.

6.  **Display & Download**: The final report object is sent back to the frontend, where it's rendered in a user-friendly format. The user can then download this comprehensive report as a PDF for offline viewing and sharing.

## The Multi-Agent System (ADK Implementation)

This project is a full implementation of the agentic pattern described by the **Agent Development Kit (ADK)**. We use **Genkit** as the core framework to build and orchestrate this multi-agent system.

### Manager Agent (The Orchestrator)

The Manager Agent is the brain of the operation. It interprets the user's intent, delegates tasks to the appropriate specialist agents, and synthesizes their findings into the final report.

-   **File Location**: `src/ai/flows/main-query-flow.ts`

### Specialist Agents (The Team)

Each specialist agent is a Genkit tool with a specific area of expertise. They are designed to be modular and independent.

-   **File Location**: All specialist agents are located in the `src/ai/agents/` directory.
-   **Agents Include**:
    -   `planning-agent.ts`: Analyzes demand forecasting and market trends.
    -   `sourcing-agent.ts`: Researches suppliers and raw material pricing.
    -   `manufacturing-agent.ts`: Investigates production processes and quality control.
    -   `inventory-agent.ts`: Researches optimal stock levels and strategies.
    -   `delivery-agent.ts`: Analyzes logistics and transportation routes.
    -   `returns-agent.ts`: Investigates reverse logistics and return policies.
    -   `anomaly-detection-agent.ts`: Monitors data streams for unusual events like price spikes or delays.

## Google Cloud & AI Ecosystem Integration

The application is built to leverage the Google Cloud ecosystem for robust, scalable AI functionality.
The application is built to leverage the **Google Cloud AI** ecosystem for robust, scalable AI functionality.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                          │
└───────────────────────────┬─────────────────────────────────┘
                           │
┌───────────────────────────┴─────────────────────────────────┐
│                    Cloud Run Frontend                       │
│           (Next.js + React + Tailwind CSS)                 │
└───────────────────────────┬─────────────────────────────────┘
                           │
┌───────────────────────────┴─────────────────────────────────┐
│                Manager Agent (Orchestrator)                 │
│              Cloud Run Service with ADK/Genkit             │
└─┬─────────────┬──────────────┬──────────────┬──────────────┘
  │             │              │              │
  ▼             ▼              ▼              ▼
┌──────┐    ┌──────┐     ┌──────────┐   ┌──────────┐
│Agent1│    │Agent2│     │  Agent3  │   │  Agent4  │
│Job   │    │Job   │     │   Job    │   │   Job    │
└──┬───┘    └──┬───┘     └────┬─────┘   └────┬─────┘
   │           │              │              │
   └───────────┴──────────────┴──────────────┘
                           │
┌───────────────────────────┴─────────────────────────────────┐
│                   Google Cloud Services                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────────┐   │
│  │BigQuery │  │ Cloud   │  │Vertex AI│  │NVIDIA L4 GPUs│   │
│  │Analytics│  │Storage  │  │Models   │  │(Cloud Run)   │   │
│  └─────────┘  └─────────┘  └─────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Components

1. **Frontend Layer**
   - Deployed on Cloud Run
   - Handles user interactions and report visualization
   - Located in `/src/app/` and `/src/components/`

2. **Orchestration Layer**
   - Manager Agent running on Cloud Run
   - Coordinates all specialist agents
   - Implements ADK patterns
   - Located in `/src/ai/flows/main-query-flow.ts`

3. **Agent Layer**
   - Each agent runs as a separate Cloud Run job
   - Specialized for specific supply chain functions
   - All agents in `/src/ai/agents/`

4. **Data & ML Layer**
   - BigQuery for data analytics
   - Cloud Storage for object storage
   - NVIDIA L4 GPUs for ML inference
   - Services configured in `/src/services/`

### Google AI Integration

The application leverages Google's powerful AI infrastructure:

- **File Location**: Configuration in `src/ai/genkit.ts`
- **Implementation Details**:
  - Uses Vertex AI for production workloads
  - Integrates Gemini 2.0 models via `googleai/gemini-2.0-flash`
  - ADK-compliant agent implementation
  - GPU-accelerated inference using NVIDIA L4


## Deployment and Development

### Local Development
1. **Start the Next.js Frontend:**
   ```bash
   npm run dev
   ```

2. **Start the AI Backend (Genkit):**
   ```bash
   npm run genkit:watch
   ```

### Cloud Run Deployment
1. **Build and Deploy Frontend:**
   ```bash
   gcloud run deploy nexuschain-frontend \
     --source . \
     --region europe-west4 \
     --platform managed
   ```

2. **Deploy Agent Services:**
   ```bash
   # Deploy manager agent
   gcloud run deploy manager-agent \
     --source ./src/ai/flows \
     --region europe-west4 \
     --platform managed

   # Deploy specialist agents
   for agent in sourcing manufacturing inventory delivery
   do
     gcloud run deploy $agent-agent \
       --source ./src/ai/agents/$agent-agent \
       --region europe-west4 \
       --platform managed
   done
   ```

3. **Configure GPU Workloads:**
   ```bash
   gcloud run deploy ml-inference \
     --source . \
     --region europe-west4 \
     --platform managed \
     --accelerator count=1,type=nvidia-l4
   ```

### BigQuery Integration

The application is architected to integrate with enterprise-level data stored in BigQuery, allowing it to move from open-internet simulation to highly precise, company-specific analysis.

-   **File Location**: `src/services/bigquery.ts`
-   **Implementation Details**:
    -   This service file contains a mock function (`getHistoricalSalesData`) that simulates fetching data from a BigQuery table. In a production environment, this file would contain the actual client logic to query live sales, inventory, or ERP data.

### Firebase App Hosting

The project is ready for deployment and scaling via Firebase App Hosting.

-   **File Location**: `apphosting.yaml`
-   **Implementation Details**:
    -   This configuration file contains the necessary settings for a production deployment on Firebase's managed infrastructure.
