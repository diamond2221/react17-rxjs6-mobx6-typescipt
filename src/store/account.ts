import { action, computed, observable, makeObservable } from "mobx";

export class AccountStore {
    constructor() {
        makeObservable(this)
    }

    @observable public userName = ''
    @observable public phoneNumber = ''
    @observable public sex = 1 as 1 | 2 | null

    @computed
    get sexStr() {
        return this.sex === 1 ? '男' : this.sex === 2 ? '女' : ''
    }

    @computed
    public get userInfo() {
        return {
            userName: this.userName,
            phoneNumber: this.phoneNumber,
            sex: this.sex,
            sexStr: this.sexStr,
            token: '',
            uid: ''
        }
    }

    @action.bound
    SET_USERNAME(userName: string) {
        this.userName = userName;
    }
}

const accountStore = new AccountStore()
export default accountStore
