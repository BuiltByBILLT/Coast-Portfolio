import { dashTest, skuTest } from './matchTests.js'
// import cloverInv from './data/cloverInv.js'

export function matchChildren(parent, cloverInv) {

    if (!parent.options.length) return

    for (const clover of cloverInv) {

        let suggestion = { name: clover.Name, price: clover.Price, sku: clover.SKU, pCode: clover['Product Code'], cloverID: clover['Clover ID'] }
        // if cloversku is in option name
        for (const option of parent.options) {
            if (clover.SKU.length < 4) break;
            if (option.oName.includes("(" + clover.SKU + ")")) {
                parent.suggestions.push(suggestion)
                console.log('PUSHED)', parent.pID, option.oName, clover.SKU)
            }
            if (option.oName.includes("#" + clover.SKU)) {
                parent.suggestions.push(suggestion)
                console.log('PUSHED#', parent.pID, option.oName, clover.SKU)
            }
        }

        if (clover.SKU.slice(0, parent.pID.length) == parent.pID && clover.SKU[parent.pID.length] == "-") { // Suggestion <- pID in Clover SKU
            parent.suggestions.push(suggestion)
        }
        if (clover.SKU == parent.pID) {
            parent.suggestions.push(suggestion)
        }
    }

    if (parent.suggestions.length) {
        let skuResult = skuTest(parent.options, parent.suggestions)
        let dashResult = dashTest(parent.pID, parent.options, parent.suggestions)

        for (const option of parent.options) {
            if (option.dashTest.cloverID) option.cloverID = option.dashTest.cloverID
            if (option.skuTest.cloverID) option.cloverID = option.skuTest.cloverID
        }
        return

    } else {
        // map through options for sku
    }

}