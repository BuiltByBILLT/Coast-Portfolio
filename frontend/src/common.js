export const toUSD = (cents) => {
    if (!cents) return "$0.00"
    return (Number(cents) / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })
}
export const toCurrency = (string, currency) => {
    return string.toLocaleString("en-US", { style: "currency", currency: currency })
}

export const envImage = (url) => {
    if (url && url.substr(0, 6) === "static") return "/" + url
    if (url) {
        // console.log(url)
        if (process.env.NODE_ENV == "development") {
            return "https://www.coastairbrush.com/" + url
        }
        else {
            return "/" + url
        }
    }
    else return "/static/sample.jpg"
}

export const firstImage = (product) => {
    if (product && product.images && product.images[0]) return product.images[0].imageSrc
    else return "static/sample.jpg"
}
