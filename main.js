import fs from "fs";
import readline from "readline";

class SearchProduct {
    constructor() {
        // date initiale
        this.data = {
            products: []
        }

        // Mesajele care se afiseaza in consecinta de actiuni
        this.message = {
            INPUT_NAME: "Care este numele produsului? ",
            NOT_FOUND: "Ne pare rău, produsul nu a fost găsit în magazinul nostru.",
            ADD_PRODUCT: "Doriti sa adaugati un produs nou? (Y/N) ",
            SUCCESS: "Prodsul a fost adaugat cu succes",
            NAME: "Nume: ",
            PRICE: "Preț: ",
            QUANTITY: "Cantitate disponibila: "
        }

        fs.readFile('./data.json', 'utf8', (err, data) => {
            if (err) throw err;
            this.data = JSON.parse(data) || {};
            this.init()
        });
    }

    // Adaugam un nou produs in variabila data
    add({name, price, quantity}) {
        this.data.products.push({
            name,
            price,
            quantity: quantity
        })
    }

    // Cautam daca exista produsul introdus de noi
    search(name) {
        if(!this.data?.products) return false;

        return this.data?.products.filter(data => {
            if(data.name.toLowerCase() === name.toLowerCase()) return data;
        })
    }

    // Afisam prodsul gasit
    showProduct({name, price, quantity}) {
        console.log(`
            ${this.message.NAME} ${name}  
            ${this.message.PRICE} ${price}  
            ${this.message.QUANTITY} ${quantity}  
        `)
    }

    // Adaugam produsele in fisier
    writeInFile() {
        fs.writeFile("data.json", JSON.stringify(this.data), (err) => {
            // console.log(err)
        })
    }

    init() {
        // Initierea pachetului node pentru introducerea textului in consola
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        console.log(`=========================`)
        // Intrebam numele produsului
        rl.question(this.message.INPUT_NAME, (name) => {
            let search = this.search(name);

            if(search.length) {
                search.forEach(item => this.showProduct(item))
                rl.close();
            } else {
                console.log(this.message.NOT_FOUND);
                // Intrebam daca e nevoie sa adaugam un porodus nou
                rl.question(this.message.ADD_PRODUCT, (answer) => {
                    if(answer === "Y") {
                        let newItem = {}

                        // Introducem caracteristicile produsului nou
                        rl.question(this.message.NAME, (newname) => {
                            newItem.name = newname;

                            rl.question(this.message.PRICE, (price) => {
                                newItem.price = price;

                                rl.question(this.message.QUANTITY, async (quantity) => {
                                    // inchidem indeplinirea readline
                                    await rl.close();
                                    newItem.quantity = quantity;

                                    // adaugam produsul nou in data
                                    await this.add(newItem);


                                    await this.writeInFile();
                                    console.log(this.message.SUCCESS);
                                    await this.init();
                                });
                            });
                        });
                    } else {
                        // inchidem indeplinirea readline
                        rl.close();
                        this.init();
                    }
                });
            }
        });
    }
}

new SearchProduct();