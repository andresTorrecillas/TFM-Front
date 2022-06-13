export interface DecodedJwt{
  header: {
    type: string,
    algorithm: string,
  }
  payload: {
    issuedAt: number,
    expirationTime: number,
    user: string
  }
}
