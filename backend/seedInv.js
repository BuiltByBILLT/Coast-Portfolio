import products from './data/products.js'
import cloverInv from './data/cloverInv.js'
import options from './data/options.js'
import optionGroups from './data/optionGroups.js'
import productsWithOptions from './data/productsWithOptions.js'
import categories from './data/categories.js'

import Inventory from './models/inventoryModel.js'


import ObjectsToCsv from 'objects-to-csv'
import connectDB from './config/db.js'
import dotenv from 'dotenv'

dotenv.config()
connectDB()

// var cloverRaw = XlsxDataAsJson.parseFile(process.cwd() + "\\backend\\cloverRaw.xlsx");
// cloverRaw = cloverRaw.filter(row => row['Clover ID'])
// console.log("from Clover export", cloverRaw.length)

const importData = async () => {


    // custom rules ===================================================
    // voilet 
    // fix skus
    // custom rules ===================================================

    let count = 0
    let countGroups = 0
    let countOptions = 0
    let extraOptions = 0
    let upgrades = 0
    // let cloverLeftover = 0

    // Price to Cents
    cloverInv.forEach(inv => { inv.Price = Math.round(Number(inv.Price) * 100) })
    products.forEach(product => { product.pPrice = Math.round(Number(product.pPrice) * 100) })
    products.forEach(product => { product.pListPrice = Math.round(Number(product.pListPrice) * 100) })
    options.forEach(option => { option.optPriceDiff = Math.round(Number(option.optPriceDiff) * 100) })

    // Disable Products in productsWithOptions from products
    let turnedOff = 0
    products.forEach(product => {
        if (product.pDisplay == 0) {
            let p2 = productsWithOptions.find(p2 => p2.pID == product.pID)
            if (p2.pDisplay == 1) turnedOff++
            p2.pDisplay = 0
        }
    });
    // console.log(turnedOff, "products in disabled in ProductsWithOptions from Product")


    // Disable Products in Disabled Categories 
    let turnedOffCat = 0
    products.forEach(product => {
        let category = categories.find(category => category.sectionID == product.pSection)
        if (category && category.sectionDisabled == 127) {
            if (product.pDisplay == 1) turnedOff++
            product.pDisplay = 0
            let p2 = productsWithOptions.find(p2 => p2.pID == product.pID)
            p2.pDisplay = 0
        }
    });
    // console.log(turnedOffCat, "products in disabled categories")

    //Load Options
    products.forEach(product => {
        product.options = []
    });
    cloverInv.forEach(clover => {
        clover.iParent = ""
        clover.iSelectionName = ""
    });
    for (let i = 0; i < productsWithOptions.length; i++) {
        const productOption = productsWithOptions[i]
        const productIndex = products.findIndex(product => product.pID == productOption.pID)
        // If pID Match
        if (productIndex != -1) {

            // Skip Products not Displayed
            if (productOption.pDisplay == 0) continue

            // Skip Products with Mulitple Options
            const extra = productOption.Option_Group_IDs.split(',')[1]
            if (extra) {
                extraOptions++
                continue
            }

            // Match Option Group from optionGroups
            const optionGroupID = productOption.Option_Group_IDs.split(',')[0]
            const optionGroupIndex = optionGroups.findIndex(optionGroup => optionGroup.optGrpID == optionGroupID)
            // If Option_Group_IDs Match
            if (optionGroupIndex != -1) {

                // Skip Products with Upgrades (AV-TT)
                if (optionGroups[optionGroupIndex].forceSelection == -2) {
                    upgrades++
                    continue
                }

                // Load Options Group Text into Products
                const optionGroupText = optionGroups[optionGroupIndex].optGrpName
                products[productIndex].optionGroup = optionGroupText

                // Load Options into Products
                options.forEach(option => {
                    if (option.optGroup == optionGroupID) {
                        const newOption = {
                            optName: option.optName,
                            priceDiff: option.optPriceDiff
                        }
                        products[productIndex].options.push(newOption)
                        countOptions++
                        // console.log("pushed", products[productIndex].pID)
                    }
                })
                // if (products[productIndex].options.length == 1) console.log(products[productIndex].pID)  // Parents with Only One Option
            }
        }
    }

    // Create Parents Object
    // let parentsSplit = []
    var parents = []
    let leftoverOptions = []
    let potentialMatch = 0
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        let group = { pID: product.pID, pName: product.pName, options: [], suggestion: [] }
        for (let optIndex = 0; optIndex < product.options.length; optIndex++) {
            const option = product.options[optIndex];
            group.options.push({ name: option.optName, price: option.priceDiff })
            // parentsSplit.push({ pID: product.pID, pName: product.pName, option: option.optName })
        }
        if (group.options.length) parents.push(group)
    }

    let success = 0
    let duplicatePrice = 0
    let wrongPrice = 0
    let noNumber = 0
    let moreNumber = 0
    let lessNumber = 0
    let wrongNumber = 0
    // Suggestion Layers ==========================================================================================================
    for (let p = 0; p < parents.length; p++) {
        const parent = parents[p];
        let options = parent.options



        let suggested = []

        // Layer 1: pID is the start of the SKU AND the next char is "-"
        suggested = cloverInv.filter(cloverItem => {
            let subSKU = cloverItem.SKU.substring(0, parent.pID.length)
            let subCode = String(cloverItem['Product Code']).substring(0, parent.pID.length)
            return (subSKU == parent.pID && cloverItem.SKU[parent.pID.length] == "-") || cloverItem.SKU == parent.pID || (subCode == parent.pID && cloverItem['Product Code'][parent.pID.length] == "-") || cloverItem['Product Code'] == parent.pID
            // return subSKU == parent.pID || cloverItem.SKU == parent.pID || subCode == parent.pID || cloverItem['Product Code'] == parent.pID
        })

        // Layer 2: Number of suggestions Equals Number of Options 
        if (suggested.length == options.length) {


            // Layer 3: All Prices Match
            options.sort(function (a, b) { return a.price - b.price; });
            suggested.sort(function (a, b) { return a.Price - b.Price; });

            let all = true
            for (let s = 0; s < suggested.length; s++) {
                if (options[s].price != suggested[s].Price) all = false
            }
            if (all) {

                // Check For Duplicate Prices 
                if (options.length == new Set(options.map((option) => option.price)).size) {

                    //Success! Push
                    parent.suggestion.push("Success-1")
                    suggested.forEach(suggested => parent.suggestion.push({ name: suggested.Name, price: suggested.Price }))
                    success++
                    // Push to CloverInv
                    suggested.forEach((suggestion, index) => {
                        let inv = cloverInv.find(inv => inv['Clover ID'] == suggestion['Clover ID'])
                        inv.iParent = parent.pID
                        inv.iSelectionName = parent.options[index].name
                        // inv.iPrice = parent.options[index].price // Hide to keep Website Prices
                    })

                    continue

                } else {
                    parent.suggestion.push("Duplicate Prices", options.length)
                    suggested.forEach(suggested => parent.suggestion.push({ name: suggested.Name, price: suggested.Price }))
                    duplicatePrice++
                }


            } else { // Layer 4: Some Prices Match
                parent.suggestion.push("Not All Prices Match")
                suggested.forEach(suggested => parent.suggestion.push({ name: suggested.Name, price: suggested.Price }))
                wrongPrice++
            }

        } else {
            if (suggested.length == 0) {
                parent.suggestion.push("No Suggestions")
                noNumber++
            }
            else {
                if (suggested.length > options.length) {
                    parent.suggestion.push("More Suggestions:" + suggested.length)
                    suggested.forEach(suggested => parent.suggestion.push({ name: suggested.Name, price: suggested.Price }))
                    moreNumber++
                }
                if (suggested.length < options.length) {
                    parent.suggestion.push("Less Suggestions")
                    suggested.forEach(suggested => parent.suggestion.push({ name: suggested.Name, price: suggested.Price }))
                    lessNumber++

                    // ================================================================================================================================================================

                    // Try with '-' removed from pID 
                    // Try with '-xxx' removed from pID 

                    // Clover SKU doesn't use '-' 
                    suggested = cloverInv.filter(cloverItem => {
                        let subSKU = cloverItem.SKU.substring(0, parent.pID.length)
                        let subCode = cloverItem['Product Code'].substring(0, parent.pID.length)
                        // return (subSKU == parent.pID && cloverItem.SKU[parent.pID.length] == "-") || cloverItem.SKU == parent.pID || (subCode == parent.pID && cloverItem['Product Code'][parent.pID.length] == "-") || cloverItem['Product Code'] == parent.pID
                        return subSKU == parent.pID || cloverItem.SKU == parent.pID || subCode == parent.pID || cloverItem['Product Code'] == parent.pID

                    })
                    // Layer 2: Number of suggestions Equals Number of Options 
                    if (suggested.length == options.length) {


                        // Layer 3: All Prices Match
                        options.sort(function (a, b) { return a.price - b.price; });
                        suggested.sort(function (a, b) { return a.Price - b.Price; });

                        let all = true
                        for (let s = 0; s < suggested.length; s++) {
                            if (options[s].price != suggested[s].Price) all = false
                        }
                        if (all) {

                            // Check For Duplicate Prices 
                            if (options.length == new Set(options.map((option) => option.price)).size) {

                                //Success! Push
                                parent.suggestion.push("Success-1b")
                                suggested.forEach(suggested => parent.suggestion.push({ name: suggested.Name, price: suggested.Price }))
                                success++
                                // Push to CloverInv
                                suggested.forEach((suggestion, index) => {
                                    let inv = cloverInv.find(inv => inv['Clover ID'] == suggestion['Clover ID'])
                                    inv.iParent = parent.pID
                                    inv.iSelectionName = parent.options[index].name
                                    // inv.iPrice = parent.options[index].price // Hide to keep Website Prices
                                })
                                continue

                            } else {
                                parent.suggestion.push("Duplicate Prices-1b", options.length)
                                suggested.forEach(suggested => parent.suggestion.push({ name: suggested.Name, price: suggested.Price }))
                                duplicatePrice++
                            }

                        } else { // Layer 4: Some Prices Match
                            parent.suggestion.push("Not All Prices Match-1b")
                            suggested.forEach(suggested => parent.suggestion.push({ name: suggested.Name, price: suggested.Price }))
                            wrongPrice++
                        }

                    }
                    // ================================================================================================================================================================
                }
            }
            // wrongNumber++
        }

        // Layer 1: All Option Names Name Contains SKU
        suggested = []
        let contains = options.filter(option => option.name.includes("(") && option.name.includes(")"))
        if (options.length == contains.length) {
            parent.suggestion.push("Parenthesis")

            let temp = []
            // SKU in name matches only one SKU in Clover
            options.forEach(option => {
                let nameSKU = option.name.match(/\((.*)\)/).pop()
                let match = cloverInv.filter(cloverItem => cloverItem.SKU == nameSKU)

                // Only one Clover Item with SKU
                if (match.length == 1) {
                    temp.push(match[0])
                    // parent.suggestion.push({ name: match[0].Name, price: match[0].Price })
                }
            })
            // All Options have one match
            if (temp.length == options.length) {
                suggested = [...temp]

                //Check for Price Match


                // Success!
                parent.suggestion.push("Success-2")
                suggested.forEach(suggested => parent.suggestion.push({ name: suggested.Name, price: suggested.Price }))
                success++
                // Push to CloverInv
                suggested.forEach((suggestion, index) => {
                    let inv = cloverInv.find(inv => inv['Clover ID'] == suggestion['Clover ID'])
                    inv.iParent = parent.pID
                    inv.iSelectionName = parent.options[index].name
                    // inv.iPrice = parent.options[index].price // Hide to keep Website Prices
                })
                continue

            } else {
                parent.suggestion.push("Match Number: " + suggested.length)
                suggested.forEach(suggested => parent.suggestion.push({ name: suggested.Name, price: suggested.Price }))
            }
        }


        // Layer 1: Clover Name Includes Parent Words
        suggested = []


    }
    console.log(success, "success")
    console.log(wrongPrice, "wrong price")
    console.log(lessNumber, "less number")
    console.log(moreNumber, "more number")
    console.log(noNumber, "no number")
    console.log(duplicatePrice, "duplicate price")
    console.log(parents.length, "total")


    let parentsCSV = new ObjectsToCsv(parents);
    await parentsCSV.toDisk('./parents.csv');
    let leftoverOptionsCSV = new ObjectsToCsv(leftoverOptions);
    await leftoverOptionsCSV.toDisk('./leftoverOptions.csv');
    let cloverInvCSV = new ObjectsToCsv(cloverInv);
    await cloverInvCSV.toDisk('./cloverInv.csv');
    // let parentsSplitCSV = new ObjectsToCsv(parentsSplit);
    // await parentsSplitCSV.toDisk('./parentsSplits.csv');



    // // Collect Leftovers From Website Products
    // let websiteLeftovers = []
    // for (let index = 0; index < products.length; index++) {
    //     const product = products[index];
    //     if (!product.cloverID) {
    //         let newProduct = product
    //         newProduct.pDescription = ""
    //         newProduct.pLongDescription = ""
    //         websiteLeftovers.push(newProduct)
    //     }
    // }
    // let webcsv = new ObjectsToCsv(websiteLeftovers);
    // await webcsv.toDisk('./websiteLeftovers.csv');

    // // Collect Leftovers From Clover
    // let cloverLeftovers = []
    // for (let i = 0; i < cloverInv.length; i++) {
    //     const cloverItem = cloverInv[i];
    //     let index = products.findIndex(product => product.cloverID == cloverItem["Clover ID"])
    //     if (index == -1) {
    //         cloverLeftovers.push(cloverItem)
    //     }
    // }
    // let clovercsv = new ObjectsToCsv(cloverLeftovers);
    // await clovercsv.toDisk('./cloverLeftovers.csv');

    // // Modifiers in Use By Clover
    // let cloverWithMods = []
    // for (let index = 0; index < cloverInv.length; index++) {
    //     const cloverItem = cloverInv[index];
    //     if (cloverItem["Clover ID"] && cloverItem["Modifier Groups"] && cloverItem["Modifier Groups"] != "DISCONTINUED ITEM") {
    //         cloverWithMods.push(cloverItem)
    //     }
    // }


    // console.log(products.length + " products from Products")
    // console.log(productsWithOptions.length + " products from Product options")
    // console.log(cloverInv.length + " products from Clover")
    // console.log(count + " products loaded with Clover ID")
    // console.log(countGroups + " products loaded as Group")
    // console.log(countOptions + " products loaded as Options")
    // console.log(websiteLeftovers.length + " Leftovers from Website Products")
    // console.log(cloverWithMods.length + " Clover Items with Mods")
    // console.log(leftoverOptions + " Options without Clover ID")

    // console.log(extraOptions, "products with Multiple Options")
    // console.log(upgrades, "products with Upgrade Options")



    // Load Solo Products ============================================================================================
    let single = 0
    products.forEach(product => {
        if (!products.options) {
            let clover = cloverInv.find(clover => clover.SKU == product.pID)
            if (clover) {
                clover.iParent = product.pID
                clover.iListPrice = product.pListPrice
                single++
            }
            else {
                // Guess by Words
            }
        }
    })
    console.log(single, "Loaded cloverInv with pID, where pID is clover SKU")

    // Load into Mongoose ===========================================================================================

    try {
        // Convert Clover to Inventory
        let numOptions = 0
        let inventory = []
        cloverInv.forEach(clover => {
            if (clover.Name) {
                inventory.push({
                    cloverID: clover['Clover ID'],
                    cloverName: clover.Name,
                    iParent: clover.iParent,
                    iSelectionName: clover.iSelectionName,
                    iPrice: clover.Price,
                    iListPrice: clover.iListPrice,
                    iStock: Number(clover.Quantity),
                    // iStock: Number(clover.Quantity) + 10,
                    // iDisplay: 1,
                    iSell: 1,
                })
            }
            if (clover.iSelectionName) numOptions++
        })
        await Inventory.deleteMany()
        await Inventory.insertMany(inventory)
        let inventoryCSV = new ObjectsToCsv(inventory);
        await inventoryCSV.toDisk('./inventory.csv');

        console.log(numOptions, "Loaded cloverInv as an Option")

        process.exit()
        console.log("success!")
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }

}
importData()


