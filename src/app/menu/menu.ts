import { CoreMenu } from '@core/types'
import { Role } from 'app/auth/models'

export const menu: CoreMenu[] = [
  {
    id: 'project-list',
    title: 'Proyektlər',
    translate: 'MENU.PROJECTS',
    type: 'item',
    icon: 'circle',
    url: 'project/list',
    role: ["User", "Admin"]
  },
  {
    id: 'project-subprocess',
    title: 'Alt prosesslər',
    translate: 'MENU.PROJECTS',
    type: 'item',
    icon: 'circle',
    url: 'project/subprocess',
    role: ["User", "Admin"]
  },
  {
    id: 'project-report',
    title: 'Hesabatlar',
    translate: 'MENU.PROJECTS',
    type: 'item',
    icon: 'circle',
    url: 'report/project-report',
    role:["User","Admin"]
  },
  {
    id: 'admin',
    title: 'Administration',
    translate: 'MENU.PROJECTS',
    type: 'item',
    icon: 'circle',
    url: 'admin/roles',
    role:["Admin"]
  }

]
