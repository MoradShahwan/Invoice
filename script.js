const insert = document.querySelector("#insert");
const save = document.querySelector("#save");
const cancel = document.querySelector("#cancel");
const product_description = document.querySelector("#product_description");
const product_quantity = document.querySelector("#product_quantity");
const product_price = document.querySelector("#product_price");
const myForm = document.querySelector("form");
const inovice = document.querySelector("#items");

let items = JSON.parse(localStorage.getItem('invoiceItems')) || [];
let whatToEdit = 0;

insert.addEventListener("click", function(e){
    e.preventDefault(); // Prevent form submission

    // Test alert to verify the click handler is working
    console.log("Insert button clicked");

    if (!product_description.value || !product_quantity.value || !product_price.value) {
        Swal.fire({
            title: 'שגיאה!',
            text: 'נא למלא את כל השדות',
            icon: 'error',
            confirmButtonText: 'אישור'
        });
        return;
    }

    // Add the item
    items.push({
        description: product_description.value,
        quantity: product_quantity.value,
        price: product_price.value
    });

    // Show success message
    Swal.fire({
        title: 'הצלחה!',
        text: 'הפריט נוסף בהצלחה',
        icon: 'success',
        confirmButtonText: 'אישור'
    }).then(() => {
        // After clicking OK
        reload();
        myForm.reset();
    });
});

cancel.addEventListener("click", function(){
    insert.style.display = "block";
    cancel.style.display = "none";
    save.style.display = "none";
    myForm.reset();
});

save.addEventListener("click", function(e){
    e.preventDefault(); // Prevent any default action
    console.log("Save button clicked"); // Debug message

    try {
        Swal.fire({
            title: 'הצלחה!',
            text: 'החשבונית נשמרה בהצלחה',
            icon: 'success',
            confirmButtonText: 'אישור'
        });
    } catch (error) {
        console.error("SweetAlert error:", error);
    }

    items[whatToEdit].description = product_description.value;
    items[whatToEdit].price = product_price.value;
    items[whatToEdit].quantity = product_quantity.value;
    reload();

    myForm.reset();
    insert.style.display = "block";
    save.style.display = "none";
    cancel.style.display = "none";
    
});

inovice.addEventListener("click", function(event){
    const thisId = event.target.dataset.id;

    if(event.target.classList.contains("delete")){
        Swal.fire({
            title: 'האם אתה בטוח?',
            text: "לא תוכל לשחזר פריט זה!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'כן, מחק!',
            cancelButtonText: 'ביטול'
        }).then((result) => {
            if (result.isConfirmed) {
                items.splice(thisId,1);
                reload();
                
                Swal.fire(
                    'נמחק!',
                    'הפריט נמחק בהצלחה.',
                    'success'
                )
            }
        })
    }
    else if(event.target.classList.contains("edit")){
        whatToEdit = thisId;
        insert.style.display = "none";
        cancel.style.display = "block";
        save.style.display = "block";

        product_description.value = items[thisId].description;
        product_quantity.value = items[thisId].quantity;
        product_price.value = items[thisId].price;
    }
});


function reload (){
    inovice.innerHTML = '';
    let sub_total = 0;
    items.forEach(( item , index ) => {
        sub_total = sub_total + (item.price * item.quantity);
        inovice.innerHTML +=
    `
    <tr>
        <td>${index+1}</td>
        <td>${item.description}</td>
        <td>${item.price}</td>
        <td>${item.quantity}</td>
        <td>${item.price * item.quantity}</td>
        <td>${item.price * item.quantity * 1.17}</td>
        <td>
            <button class="delete btn btn-danger btn-sm" data-id="${index}">מחק</button>
            <button class="edit btn btn-warning btn-sm" data-id="${index}">ערוך</button>
        </td>
    </tr>
    `
    });

    if(sub_total == 0){
        document.querySelector("#sub_total").innerText = '0';
        document.querySelector("#vat").innerText = '0';
        document.querySelector("#total").innerText = '0';
    }
    else{
        document.querySelector("#sub_total").innerText = sub_total;
        document.querySelector("#vat").innerText = Math.round(sub_total * 0.17);
        document.querySelector("#total").innerText = Math.round(sub_total * 1.17);
    }

    localStorage.setItem('invoiceItems', JSON.stringify(items));
};
 reload();