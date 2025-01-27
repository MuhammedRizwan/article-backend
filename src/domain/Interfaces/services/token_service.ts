export default interface Token_service{
    generateAccessToken(userId: string): string ,
    generateRefreshToken(userId: string): string ,
    verifyAccessToken(token: string): any,
    verifyRefreshToken(token: string): any 
}