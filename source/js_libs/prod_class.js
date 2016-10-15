/*
 * Содержит два класса.
 * 1 -Продукт в магазине, 2 его наследник продукт в холодильнике
 * с указанием количества.
 */

function ProductInStore(obj)
{
    for(var a in obj)
        this[a] = obj[a];
}

ProductInStore.prototype.toHTML = function()
{
    var str = "";
    str += "<div draggable='true' class='thumbnail prod_item'";
    str += "style='background-image: url(";
    str += this.image_src+")' ";
    str += "id='"+this.id_html+"'>";
    
    str += "<span class='text_prod_item'  id='";
    str += this.id_html + "'>";
    str += this.title+"</span>";
    
    if( this.count !== undefined)
    {
        str += "</br><small class='text_prod_item'  id='";
        str += this.id_html + "'>" + this.count + " ";
        str += this.nt + "</small>";
    }
        
    str += "</div>";
    
    return str;
};

function ProductInIcebox( obj, new_id_part, count, shelf )
{
    ProductInStore.call(this, obj);
    
    this.stor_id = this.id_html;
    this.id_html += new_id_part; 
    this.count = count;
    this.shelf = shelf;

}

ProductInIcebox.prototype = Object.create(ProductInStore.prototype);
