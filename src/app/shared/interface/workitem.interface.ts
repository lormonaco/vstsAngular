export interface IWorkItem {
    id?: string;
    title?: string;
    version?: string;
    originalEstimate?: number;
    completed?: number;
    assignedTo?: string;
    critical?: string;
    remainingWork?: number;
}