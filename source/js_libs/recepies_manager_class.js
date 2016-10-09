function RecipsManager( recips_list )
{
    this.active_recip = null;
    this.repic_list = [];
    
    for( var i = 0; i < recips_list.length; i++ )
        this.repic_list.push( new  Recip( recips_list[i] ) );
}

RecipsManager.prototype.CreateRecip = function()
{
    if (this.active_recip === null)
        return false;
    
    var ing_list = []; var j;
    
    //check ingredient
    for ( var i =0; i < product_manager.product_list_in_icebox.length; i++)
        if( product_manager.product_list_in_icebox[i].shelf == 5)
            for ( j =0; j < this.active_recip.ingr.length; j++)
                if ( this.active_recip.ingr[j] ==  product_manager.product_list_in_icebox[i].id_html.toString().split("$")[0] )
                    ing_list.push ( product_manager.product_list_in_icebox[i] );
    
    if ( ing_list.length != this.active_recip.ingr.length )
        return false;
    
    //check count
    for ( j = 0; j < this.active_recip.ingr.length; j++)
        if ( this.active_recip.count[j] > ing_list[j].count )
            return false;
    
    for ( j = 0; j < this.active_recip.ingr.length; j++)
        ing_list[j].count = parseInt ( ing_list[j].count ) - parseInt ( this.active_recip.count[j] );
        
    // del obj if count == 0
    i = 0;
    while ( i < product_manager.product_list_in_icebox.length )
    {
        if( +product_manager.product_list_in_icebox[i].count === 0)
            product_manager.product_list_in_icebox.splice( i, 1 );
        else
            i++;
    }
    
    var new_obj = product_manager.GetProdInStore ( this.active_recip.id_html );
    
    for ( i = 0; i < product_manager.product_list_in_icebox.length; i++ )
        if( product_manager.product_list_in_icebox[i].id_html.split("$")[0] == this.active_recip.id_html &&
           product_manager.product_list_in_icebox[i].shelf == product_manager.active_shelf)
            {
                product_manager.product_list_in_icebox[i].count = parseInt ( product_manager.product_list_in_icebox[i].count ) + 1;
                product_manager.RePrintProductActiveShelfs();
                return true;
            }
            
    new_obj = new ProductInIcebox( new_obj, product_manager.GetNewId(), 1, product_manager.active_shelf);
    product_manager.product_list_in_icebox.push(new_obj);
    
    product_manager.RePrintProductActiveShelfs();
    
    return true;
}

RecipsManager.prototype.SelectRecipe = function(id)
{
    this.active_recip = this.GetRecipById( id );
    
    if( this.active_recip === null)
        return;
    
    document.getElementById( "activ_recip" ).value = this.active_recip.title ;
    document.getElementById( "instruction" ).value = this.active_recip.text ;
    var need_ingr = document.getElementById( "need_ingr" );
    
    need_ingr.innerHTML ="";
    
    var n_prod_list = [];
    
    for(var i = 0; i < this.active_recip.ingr.length; i++)
        n_prod_list.push( product_manager.GetProdInStore ( this.active_recip.ingr[i] ) );
    
    for(i = 0; i < n_prod_list.length; i++ )
    {
        n_prod_list[i] = new ProductInIcebox ( n_prod_list[i], "d", this.active_recip.count[i], -1);
        need_ingr.innerHTML += n_prod_list[i].toHTML();
    }
};

RecipsManager.prototype.GetRecipById = function( id )
{
    for(var i = 0; i < this.repic_list.length; i++)
            if( this.repic_list[i].id_html == id)
                return this.repic_list[i];
    
    return null;
};

RecipsManager.prototype.GetRecips = function( id )
{
    var rep_list = [];
    
    for(var i = 0; i < this.repic_list.length; i++)
        for(var j = 0; j < this.repic_list[i].ingr.length; j++)
            if( this.repic_list[i].ingr[j] == id)
                rep_list.push( this.repic_list[i] );
    
    return rep_list;
};

// class
function Recip( obj )
{
    for(var a in obj)
        this[a] = obj[a];
}

Recip.prototype.toHTML = function()
{
    var str = "<div onclick = 'OnRecipClick(event);'class='thumbnail \
              prod_item' style='background-image: url("+this.image_src+")' id='"+this.id_html+"'>";
    str += "<span class='text_prod_item' id='"+this.id_html+"'>"+this.title+"</span>";
    str += "</div>";
    
    return str;
};