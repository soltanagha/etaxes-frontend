
export class ProjectSubProcess {
  id?: number;
  subprocessID: number;
  projectID: number;
  statusID: number;
  subprocessDescription: string;
  filePath: string;

  constructor(subprocessID,projectID,statusID,
    subprocessDescription,filePath) {
      this.subprocessID = subprocessID;
      this.projectID = projectID;
      this.statusID = statusID;
      this.subprocessDescription = subprocessDescription;
      this.filePath = filePath;
    }
}
