import { extract, ratio, partial_ratio, token_set_ratio, token_sort_ratio, token_similarity_sort_ratio } from 'fuzzball'
// import cloverInv from './data/cloverInv.js'

// console.log('testing fuzzyOnce')
// 4102
// Aluminum Base (medium)
// More suggs than options
// const pOptions = [{ "name": "4oz", "price": 695 }, { "name": "32oz", "price": 4975 }]
// const suggestions = [{ "name": "Base MEDIUM 4oz", "price": 695 }, { "name": "Base MEDIUM Gallon", "price": 18895 }, { "name": "Base MEDIUM 32oz", "price": 4975 }, { "name": "Base MEDIUM 16oz", "price": 2625 }]

// c8511
// Anest Iwata Spray Gun & Airbrush Lube
// const pOptions = [{ 'name': 'Single (8511)', 'price': 595 }, { 'name': '10 Pack (8511-PK)', 'price': 4500 }]
// const suggestions = [{ 'name': 'Anest Iwata Spray Gun Lube Single', 'price': 495, "sku": "8511", "pCode": "8511" }, { 'name': 'Anest Iwata Spray Gun Lube 10 Pack', 'price': 2800, 'sku': "8511-PK", "pCode": " }]

// A604
// Alphanamel Alpha Dark Red
// 5 and 2 for 2.5, missing 4, space for 8 oz can vs 8oz
// const pOptions = [{ "name": "2.5oz (Squeeze Bottle)", "price": 995 }, { "name": "5oz (Squeeze Bottle)", "price": 1395 }, { "name": "4 oz Can", "price": 1395 }, { "name": "8 oz Can", "price": 1995 }]
// const suggestions = [{ "name": "Alphanamel Lumpy's Red 5oz", "price": 1395 }, { "name": "Alphanamel Lumpy's Red 8oz", "price": 1995 }, { "name": "Alphanamel Lumpy's Red 2oz", "price": 995 }]

//4042
// The David Hightower Fitch,
// Fractions
// const pOptions = [{ "name": "4042-1/4 (9/16\" length)", "price": 385 }, { "name": "4042-1/2 (3/4\" length)", "price": 581 }, { "name": "4042-3/4 (1\" length)", "price": 819 }, { "name": "4042-1 (1-3/16\" length)", "price": 1036 }]
// const suggestions = [{ "name": "Mack 4042 #¼\" David Hightower Fitch", "price": 312, "sku": "4042-1/4" }, { "name": "Mack 4042 #½\" David Hightower Fitch", "price": 488, "sku": "4042-1/2" }, { "name": "Mack 4042 #¾\" David Hightower Fitch", "price": 688, "sku": "4042-3/4" }, { "name": "Mack 4042 #1 David Hightower Fitch", "price": 860, "sku": "4042-1" }]
// Missing Sugg 1/4 to cause -1 to Duplicate
// const pOptions = [{ "name": "4042-1/4 (9/16\" length)", "price": 385 }, { "name": "4042-1/2 (3/4\" length)", "price": 581 }, { "name": "4042-3/4 (1\" length)", "price": 819 }, { "name": "4042-1 (1-3/16\" length)", "price": 1036 }]
// const suggestions = [{ "name": "Mack 4042 #½\" David Hightower Fitch", "price": 488, "sku": "4042-1/2" }, { "name": "Mack 4042 #¾\" David Hightower Fitch", "price": 688, "sku": "4042-3/4" }, { "name": "Mack 4042 #1 David Hightower Fitch", "price": 860, "sku": "4042-1" }]
// Extra and Duplicate Suggs
// const pOptions = [{ "name": "4042-1/4 (9/16\" length)", "price": 385 }, { "name": "4042-1/2 (3/4\" length)", "price": 581 }, { "name": "4042-3/4 (1\" length)", "price": 819 }, { "name": "4042-1 (1-3/16\" length)", "price": 1036 }]
// const suggestions = [{ "name": "extra", "sku": "100" }, { "name": "Mack 4042 #¼\" David Hightower Fitch", "price": 312, "sku": "4042-1/4" }, { "name": "Mack 4042 #¼\" David Hightower Fitch", "price": 312, "sku": "4042-1/4" }, { "name": "Mack 4042 #½\" David Hightower Fitch", "price": 488, "sku": "4042-1/2" }, { "name": "Mack 4042 #¾\" David Hightower Fitch", "price": 688, "sku": "4042-3/4" }, { "name": "Mack 4042 #1 David Hightower Fitch", "price": 860, "sku": "4042-1" }]

// A610
// Alphanamel Alpha Blue
// Mike Fucks up score
// const pOptions = [{ "name": "2.5oz (Squeeze Bottle)", "price": 995 }, { "name": "5oz (Squeeze Bottle)", "price": 1395 }, { "name": "4 oz Can", "price": 1395 }, { "name": "8 oz Can", "price": 1995 }]
// const suggestions = [{ "name": "Alphanamel Lil Dame's Blue 2oz", "price": 995 }, { "name": "Alphanamel Lil Dame's Blue 4oz", "price": 1395 }, { "name": "Alphanamel Mike Myer's Dark Blue 4oz", "price": 1395 }, { "name": "Alphanamel Lil Dame's Blue 8oz", "price": 1995 }]
// const suggestions = [{ "name": "Alphanamel Lil Dame's Blue 2oz", "price": 995 }, { "name": "Alphanamel Lil Dame's Blue 4oz", "price": 1395 }, { "name": "Alphanamel Lil Dame's Blue 8oz", "price": 1995 }]

// console.log(onlyDiff(['2.5oz (Squeeze Bottle)', '5oz (Squeeze Bottle)']))
// fuzzyTest(pOptions, suggestions)
// console.dir(pOptions, { depth: 4 })


// console.log(token_sort_ratio("One Shot 106L Kool Crimson 8oz", " One Shot 106L Kool Crimson 16oz"))

export function fuzzyOnce(query, suggestions, processor = (suggs) => suggs.map(sugg => sugg.name), scorer = token_sort_ratio) {
    if (!query) return { error: "no query" }
    if (suggestions.length === 1) return { error: "only one" }
    let choices = onlyDiff(processor(suggestions))
    let longest = choices.map((choice => choice.replace('SPECIAL ORDER', ""))).sort((a, b) => b.length - a.length)[0]
    if (longest.length > 9) return { error: "mixed suggs", results: [processor(suggestions), choices] }
    let results = extract(query, choices, { scorer, limit: 10 })
    // console.log(`results for ${query}`, results)
    if (results[0][1] === results[1][1]) return { winner: null, error: "no match", results }
    if (results[0][1] === 100) return { winner: suggestions[results[0][2]] }
    if (results[0][1] - results[1][1] < 10) { return { winner: null, error: "hard to say", results } }
    return { winner: suggestions[results[0][2]] }
}

function onlyDiff(strings) {
    if (strings.length == 1) return strings
    let last, flag
    for (let i = 0; i < strings[0].length; i++) {
        for (const string of strings) {
            last = i
            if (string[i] != strings[0][i]) {
                flag = true; break
            }
        } if (flag) break
        // console.log(i, last)
    }
    // console.log(last)
    let trimmed = strings.map(string => string.slice(last))
    // console.log("trimmed", trimmed)

    let subtract = 0
    // let shortest = trimmed.reduce((prev, next) => prev.length > next.length ? next.length : prev.length)
    let shortest = trimmed.slice().sort((a, b) => a.length - b.length)[0].length
    for (let i = 0; i < shortest - 1; i++) {
        let set = new Set()
        for (const string of trimmed) { set.add(string[string.length - 1 - subtract]) }
        if (set.size == 1) { subtract++ }
        else break
    }
    let middle = trimmed.map(string => string.slice(0, string.length - subtract))
    // console.log("middle", middle)
    return middle.map(string => string.normalize("NFKD"))
}


export function fuzzyTest(options, suggestions) {
    let trims = onlyDiff(options.map(option => option.name))
    // console.log("options", trims)
    options.forEach((option, index) => {
        let fuzz = fuzzyOnce(trims[index], suggestions)
        // if (fuzz.error == 'no query') console.log("query trace", trims)
        if (fuzz.winner) option.fuzzyTest = fuzz.winner
        else option.fuzzyTest = { error: fuzz.error, trace: fuzz.results }
    })
    // check Dupes


    //Return
    for (const option of options) { if (!option.fuzzyTest || option.fuzzyTest.error) return "error" }
    return "success"
}

// console.log(fuzzyTest(pOptions, suggestions))
// console.log(pOptions)



export function skuTest(options, suggestions,) {
    // console.log('testing idInName')
    let sorted = suggestions.slice().sort(function (a, b) { return b.sku.length - a.sku.length })

    for (const option of options) {
        for (const sugg of sorted) {
            if (option.oName.includes(sugg.sku)) {
                option.skuTest = sugg
                break
            } else option.skuTest = { error: "no match" }
        }
    }

    // Check for last char match
    for (const option of options) {
        if (option.skuTest.error) continue // skip if no match
        let id = option.skuTest.sku
        let start = option.oName.indexOf(id)
        let next = option.oName[start + id.length] // no last char
        if (id === option.oName) continue
        if (next === " ") continue
        if (next === ")") continue
        if (start + id.length === option.oName.length) continue
        let temp = option.skuTest
        option.skuTest = { error: 'Char Error', trace: temp }
    }

    //Return
    let filled = 0
    for (const option of options) { if (option.skuTest.cloverID) { filled = filled + 1 } }
    if (filled == options.length) return "success"
    if (filled == 0) return "no matches"
    if (filled > 0) return "partial"

    //Return
    // for (const option of options) { if (!option.skuTest || option.skuTest.error) return "error" }
    // return "success"
}


export function priceTest(options, suggestions) {

    // Remove Same Price Suggs
    let dupSuggs = suggestions.filter((sugg, index, original) => {
        return index != original.findIndex(obj => obj.price == sugg.price)
    }) // if the first price found is not the same index as current
    let uniSuggs = suggestions.filter(sugg => {
        return -1 == dupSuggs.findIndex(obj => obj.price == sugg.price)
    }) // if the price is found in dupSuggs

    // Remove Same Price options
    let dupOptions = options.filter((option, index, original) => {
        return index != original.findIndex(obj => obj.price == option.price)
    }) // if the first price found is not the same index as current
    let uniOptions = options.filter(option => {
        return -1 == dupOptions.findIndex(obj => obj.price == option.price)
    }) // if the price is found in dupOptions

    for (const option of uniOptions) {
        for (const sugg of uniSuggs) {
            if (option.price == sugg.price) {
                option.priceTest = sugg
                break
            } else option.priceTest = { error: "no match" }
        }
    }

    //Return
    for (const option of options) { if (!option.priceTest || option.priceTest.error) return "error" }
    return "success"
}

export function unique() {
    // Unique Suggs only
}

export function dashTest(pID, options, suggestions) {
    for (const option of options) {
        // If pre reduced continue
        for (const sugg of suggestions) {
            let end = sugg.sku.slice(pID.length + 1)
            let lower = option.oName.toLowerCase()
            if (!isNaN(end)) {
                if (lower.includes(Number(end) + "oz") || lower.includes(Number(end) + " oz")) {
                    if (isNaN(Number(lower[lower.indexOf(Number(end)) - 1]))) { option.dashTest = sugg }
                }
                if (end == 16 && lower.includes("pint")) { option.dashTest = sugg }
                if (end == 32 && lower.includes("quart")) { option.dashTest = sugg }
                if (end == 128 && lower.includes("gallon")) { option.dashTest = sugg }
                if (end == 12 && lower.includes("gallon") && sugg.name.toLowerCase().includes("gallon")
                ) { option.dashTest = sugg }
            }
            if (end == "P" && lower.includes("pint")) { option.dashTest = sugg }
            if (end == "P" && lower.includes("16")) { option.dashTest = sugg }
            if (end == "PT" && lower.includes("pint")) { option.dashTest = sugg }
            if (end == "PT" && lower.includes("16")) { option.dashTest = sugg }
            if (end == "Q" && lower.includes("quart")) { option.dashTest = sugg }
            if (end == "Q" && lower.includes("32")) { option.dashTest = sugg }
            if (end == "G" && lower.includes("gallon")) { option.dashTest = sugg }
            if (end == "G" && lower.includes("128")) { option.dashTest = sugg }
            if (end == "QP" && lower.includes("4oz")) { option.dashTest = sugg }
            if (end == "QP" && lower.includes("4 oz")) { option.dashTest = sugg }
            if (end == "HP" && lower.includes("8oz")) { option.dashTest = sugg }
            if (end == "HP" && lower.includes("8 oz")) { option.dashTest = sugg }
            if (end == "S" && lower.includes("small")) { option.dashTest = sugg }
            if (end == "M" && lower.includes("medium")) { option.dashTest = sugg }
            if (end == "L" && lower.includes("large") && !lower.includes("-large")) { option.dashTest = sugg }
            if (end == "XL" && lower.includes("x-large") && !lower.includes("xx")) { option.dashTest = sugg }
            if (end == "XXL" && lower.includes("xx-large")) { option.dashTest = sugg }
            if (end == "2X" && lower.includes("xx-large")) { option.dashTest = sugg }
            if (end == "3X" && lower.includes("3xl")) { option.dashTest = sugg }
            if (end == "8" && lower.includes("125g")) { option.dashTest = sugg }
            if (end == "1LB" && lower.includes("1lb")) { option.dashTest = sugg }
        }
        if (!option.dashTest) option.dashTest = { error: "no match" }
    }
    //Return
    let filled = 0
    for (const option of options) { if (option.dashTest.cloverID) { filled = filled + 1 } }
    if (filled == options.length) return "success"
    if (filled == 0) return "no matches"
    if (filled > 0) return "partial"
}


// console.log(fuzzyOnce("1/4 (9/16", suggestions, (suggs) => suggs.map(sugg => sugg.name)))




// Loop through options
// for (const option of pOptions) {
//     console.log(option.name)
//     console.log(fuzzyOnce(option.name, suggestions, (suggs) => suggs.map(sugg => sugg.name)))
//     // console.log(fuzzyOnce(option.name, suggestions, (suggs) => suggs.map(sugg => sugg.sku)))
// }

// Loop through different tests
// let option = pOptions[0].name
// console.log(option)
// console.log("ratio", fuzzyOnce(option, suggestions, (suggs) => suggs.map(sugg => sugg.sku), ratio))
// console.log("token_sort_ratio", fuzzyOnce(option, suggestions, (suggs) => suggs.map(sugg => sugg.sku), token_sort_ratio))
// console.log("token_similarity_sort_ratio", fuzzyOnce(option, suggestions, (suggs) => suggs.map(sugg => sugg.sku), token_similarity_sort_ratio))
// console.log("token_set_ratio", fuzzyOnce(option, suggestions, (suggs) => suggs.map(sugg => sugg.sku), token_set_ratio))
// console.log("partial_ratio", fuzzyOnce(option, suggestions, (suggs) => suggs.map(sugg => sugg.sku), partial_ratio))

// function findNext(skus){
//     for (const sku of skus) {

//     }
// }

// export function lookForSimilar(q, limit) {
//     let clover = cloverInv.map(clover => clover.Name)
//     return extract(q, clover, { limit: limit + 3 })
// }
// console.log(lookForSimilar("Alphanamel Lumpy's Red 4oz"))

