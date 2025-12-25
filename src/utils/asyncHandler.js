const asyncHandler = (fn) => async (res,rep,next) =>{
    try {
        await fn(res,rep,next)
    } catch (error) {
        res.status(error.statusCode || 500).json(
            {
                   success : false,
                   message : error.message
            }
        )

    }
}