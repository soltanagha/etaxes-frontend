
export class Report {
    public name: string;
    public progress: number;
    public description: string;

    constructor(name:string, progress: number, desc: string) {
        this.name = name;
        this.progress = progress;
        this.description = desc;
    }

}
