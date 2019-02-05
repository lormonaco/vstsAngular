export interface IWorkItem {
    id?: string;
    title?: string;
    version?: string;
    originalEstimate?: number;
    completed?: number;
    assignedTo?: string;
    critical?: string;
    remainingWork?: number;
    developmentStart?: string;
    developmentEnd?: string;
    netDevTime?: number;
    grossDevTime?: number;
    netEstimationDelta?: number;
    grossEstimationDelta?: number;
}