const btn = document.querySelectorAll('.btn')
const header4 = document.querySelectorAll('h4')

btn.forEach(btn => {
    btn.addEventListener('click ',() => {
        console.log(`btn ${btn.tagName} clicked`)
        if(btn.textContent === 'Add to Cart')
            console.log('you have successfully added')
    })
})


