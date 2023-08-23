export const PageSizes = [10, 25, 50, 100];
export type SortDirection = "asc" | "desc" | "";

export class ProjectState {
	filter: Record<string, string>;
	paginator: Page;
	sorting: Sort;
	searchTerm: string;

	constructor() {
		this.paginator = new Page();
		this.filter = {};
		this.sorting = new Sort();
		this.searchTerm = "";
	}
}

export class Page {
	size: number;
	page: number;
	total: number;
	pages: number;

	constructor() {
		this.size = PageSizes[0];
		this.page = 0;
		this.total = 0;
		this.pages = 0;
	}
}

export class Sort {
	column: string;
	direction: SortDirection;

	constructor() {
		this.column = "id";
		this.direction = "asc";
	}
}

export interface TableResponse<T> {
	items: T[];
	total: number;
}
