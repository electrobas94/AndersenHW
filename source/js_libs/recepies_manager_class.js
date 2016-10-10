/*
 * Класс для хранения списка рецептов и
 * оброботки связанных с ними событий
 */

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
    
    var ing_list = [];
    var j;
    
    var icebox_l = product_manager.product_list_in_icebox;
    var ar = this.active_recip;
    
    //check ingredient
    for ( var i =0; i < icebox_l.length; i++)
    {
        if( icebox_l[i].shelf == 5)
            for ( j =0; j < ar.ingr.length; j++)
            {
                if ( ar.ingr[j] ==  icebox_l[i].stor_id )
                    ing_list.push ( icebox_l[i] );
            }
    }
    
    if ( ing_list.length != ar.ingr.length )
        return false;
    
    //check count
    for ( j = 0; j < ar.ingr.length; j++)
        if ( ar.count[j] > ing_list[j].count )
            return false;
    
    for ( j = 0; j < ar.ingr.length; j++)
        ing_list[j].count = parseInt( ing_list[j].count ) - parseInt( ar.count[j] );
        
    // del obj if count == 0
    i = 0;
    while ( i < icebox_l.length )
    {
        if( +icebox_l[i].count === 0)
            icebox_l.splice( i, 1 );
        else
            i++;
    }
    
    var new_obj = product_manager.GetProdInStore ( ar.id_html );
    
    for ( i = 0; i < icebox_l.length; i++ )
    {
        if( icebox_l[i].stor_id == ar.id_html &&
            icebox_l[i].shelf   == product_manager.active_shelf )
            {
                icebox_l[i].count = parseInt ( icebox_l[i].count ) + 1;
                product_manager.RePrintProductActiveShelfs();
                
                return true;
            }
    }
            
    new_obj = new ProductInIcebox( new_obj,
                                    product_manager.GetNewId(), 1,
                                    product_manager.active_shelf );
    
    icebox_l.push( new_obj );
    
    product_manager.RePrintProductActiveShelfs();
    
    return true;
}

RecipsManager.prototype.SelectRecipe = function(id)
{
    this.active_recip = this.GetRecipById( id );
    
    var ar = this.active_recip;
    
    if( ar === null)
        return;
    
    $( "activ_recip" ).value = ar.title ;
    $( "instruction" ).value = ar.text ;
    
    var need_ingr = $( "need_ingr" );
    need_ingr.innerHTML ="";
    
    var n_prod_l = [];
    
    for( var i = 0; i < ar.ingr.length; i++ )
        n_prod_l.push( product_manager.GetProdInStore ( ar.ingr[i] ) );
    
    for(i = 0; i < n_prod_l.length; i++ )
    {
        n_prod_l[i] = new ProductInIcebox ( n_prod_l[i], "d", ar.count[i], -1);
        need_ingr.innerHTML += n_prod_l[i].toHTML();
    }
};

RecipsManager.prototype.GetRecipById = function( id_repc )
{
    for( var i = 0; i < this.repic_list.length; i++ )
    {
        let cur_repc = this.repic_list [i];
        
        if( cur_repc.id_html == id_repc )
            return cur_repc;
    }
    
    return null;
};

// Возвращает список рецептов в которых используется указанный продукт
RecipsManager.prototype.GetRecips = function( id_prod )
{
    var rep_list = [];
    
    for ( var i = 0; i < this.repic_list.length; i++ )
    {
        let cur_repc = this.repic_list [i];
        
        for ( var j = 0; j < cur_repc.ingr.length; j++ )
            if ( cur_repc.ingr [j] == id_prod )
                rep_list.push( cur_repc );
    }
    
    return rep_list;
};

// Класс рецепта
function Recip( obj )
{
    for(var a in obj)
        this[a] = obj[a];
}

Recip.prototype.toHTML = function()
{
    var str = "";
    
    str += "<div onclick = 'OnRecipClick(event);'class='thumbnail ";
    str += "prod_item' style='background-image: url("+this.image_src+")' id='";
    str += this.id_html+"'>";
    
    str += "<span class='text_prod_item' id='" + this.id_html + "'>";
    str += this.title;
    str += "</span></div>";
    
    return str;
};