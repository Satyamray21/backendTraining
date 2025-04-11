class ApiRespone{
    constructor(stausCode,data,message="sucess"){
        this.stausCode=stausCode,
        this.data=data,
        this.message=message,
        this.staus=stausCode < 400
    }
}
export {ApiRespone}