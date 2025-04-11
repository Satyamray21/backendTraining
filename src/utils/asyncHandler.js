const asyncHandler = (requestHandler) =>{
    (req,res,next)=>{
        Promise
        .resolve(requestHandler(req,res,next))//reslove
        .catch((err)=>next(err))//reject
}
}