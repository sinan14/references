export class User {
    constructor(
        //public id: string,
        public username: string,
        public password: string,
        public name:string,
        public id:string,
        public photo:string,
        public isAdmin: boolean,
        public isStore: boolean,
        private _token:string,
    ) {}

    get token(){
        // if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
        //     return null;
        // }
        return this._token
    }
}

export class StoreUser {
    constructor(
        //public id: string,
        public username: string,
        public password: string,
        public name:string,
        public id:string,
        public photo:string,
        public isStore: boolean,
        private _token:string,
    ) {}

    get token(){
        // if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
        //     return null;
        // }
        return this._token
    }
}