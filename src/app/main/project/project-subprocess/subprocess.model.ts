export class Subprocess {
    id? = undefined;
    title = '';
    dueDate = '';
    description = '';
    assignee = {
      fullName: '',
      avatar: ''
    };
    tags = [];
    completed = false;
    deleted = false;
    important = false;
  }
  