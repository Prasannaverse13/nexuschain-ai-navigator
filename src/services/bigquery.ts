/**
 * @fileoverview Mock BigQuery Client
 *
 * This file simulates a client that would interact with Google BigQuery.
 * In a real-world application, this file would contain the actual logic
 * to connect to BigQuery, execute queries, and return results.
 * 
 * While this file is currently not used by the "open-internet" focused agents,
 * it represents the future capability of integrating with internal enterprise data.
 *
 * For this prototype, it returns hardcoded mock data to be used by the agents.
 */

interface SalesData {
    month: string;
    unitsSold: number;
}

/**
 * Simulates fetching historical sales data for a given product from BigQuery.
 * @param productName - The name of the product to fetch data for.
 * @returns A promise that resolves to an array of sales data.
 */
export async function getHistoricalSalesData(productName: string): Promise<SalesData[]> {
    console.log(`Simulating BigQuery fetch for historical sales data of: ${productName}`);
    
    // In a real implementation, you would use the @google-cloud/bigquery library
    // to run a query like:
    // `SELECT month, units_sold FROM \`active-tangent-463604-p9.my_dataset.sales_history\` WHERE product_name = '${productName}' ORDER BY month;`

    // Mock data representing historical sales.
    const mockData: SalesData[] = [
        { month: '2023-01', unitsSold: 12000 },
        { month: '2023-02', unitsSold: 13500 },
        { month: '2023-03', unitsSold: 14000 },
        { month: '2023-04', unitsSold: 13000 },
        { month: '2023-05', unitsSold: 15500 },
        { month: '2023-06', unitsSold: 16000 },
        { month: '2023-07', unitsSold: 17000 },
        { month: '2023-08', unitsSold: 16500 },
        { month: '2023-09', unitsSold: 18000 },
        { month: '2023-10', unitsSold: 19500 },
        { month: '2023-11', unitsSold: 22000 },
        { month: '2023-12', unitsSold: 25000 },
    ];

    // Simulate network latency
    return new Promise(resolve => setTimeout(() => resolve(mockData), 500));
}
