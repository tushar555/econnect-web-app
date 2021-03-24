export interface SideMenu {
    name: string;
    targetBlank: number;
    routerLink: string;
    icon: string;
    iconhover: string;
    isactive: number;
    index: number;
    isExternal: number;
}

export interface UserCredentials {
  username: string;
  password: string;
  overwriteSession:boolean;
}

export interface Menu {
  prodmenu: any[];
  uatmenu: any[];
}

export interface ISideMenu {
  prodsidemenu: SideMenu[];
  uatsidemenu: SideMenu[];
}
