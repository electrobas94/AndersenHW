function ProductInStore(obj)
{
    for(var a in obj)
        this[a] = obj[a];
}

ProductInStore.prototype.toHTML = function()
{
    var str = "<div onclick = 'OnItemClick(event);' draggable='true' ondragstart='drag(event)' class='thumbnail \
              prod_item' style='background-image: url("+this.image_src+")' id='"+this.id_html+"'>";
    
    str += "<span class='text_prod_item'  id='" + this.id_html + "'>"+this.title+"</span>";
    
    if( this.count !== undefined)
        str += "</br><small class='text_prod_item'  id='" + this.id_html + "'>" + this.count + " " + this.nt + "</small>";
        
    str += "</div>";
    
    return str;
};

function ProductInIcebox( obj, new_id_part, count, shelf )
{
    ProductInStore.call(this, obj);
    
    if( new_id_part !== undefined )
        this.id_html += new_id_part;
    
    if( count !== undefined )
        this.count = count;
    else
        this.count = 0;
        
    if( shelf !== undefined )
        this.shelf = shelf;
    else
        this.shelf = 0;
}

ProductInIcebox.prototype = Object.create(ProductInStore.prototype);