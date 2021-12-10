export const toUSD = (cents) => {
    return (Number(cents) / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })
}

export const envImage = (url) => {
    if (url && url.substr(0, 6) === "static") return "/" + url
    if (url) {
        if (process.env.NODE_ENV == "development") {
            console.log("Dev")
            return "https://www.coastairbrush.com/" + url
        }
        else {
            console.log("Prod")
            return "/" + url
        }
    }
    else return "/" + "static/sample.jpg"
}

export const firstImage = (product) => {
    if (product && product.images && product.images[0]) return "/" + product.images[0].imageSrc
    else return "static/sample.jpg"
}
