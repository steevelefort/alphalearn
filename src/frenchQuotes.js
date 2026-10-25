// Guillemets français autour d'un nom de lettre ou d'un son, dans les phrases de Bobi :
// la synthèse vocale détache mieux ce qui est entre guillemets, et ne le lie pas au mot d'avant.
export function putInFrenchQuotes(text) {
  return `« ${text} »`
}
