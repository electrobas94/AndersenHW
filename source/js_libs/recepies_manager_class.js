/*
 * Класс для хранения списка рецептов и
 * оброботки связанных с ними событий
 *
 * В конце файла класс самого рецепта
 */

function RecipsManager( recips_list )
{
    this.active_recip = null;
    this.repic_list = [];
    
    for( var i = 0; i < recips_list.length; i++ )
        this.repic_list.push( new  Recip( recips_list[i] ) );
}

RecipsManager.prototype.AddNewRecip = function()
{
    if ( product_manager.result_obj === null )
        return;
    
    var ingr    = [];
    var count    = [];
    var icebox_l = product_manager.product_list_in_icebox;
    
    for (var i = 0; i < icebox_l.length; i++)
        if ( icebox_l[i].shelf == 6 )
        {
            ingr.push( icebox_l[i].stor_id );
            count.push( icebox_l[i].count );
        }
        
    if ( ingr.length === 0 )
        return;
    
    var n_recip = {};
    var r_o = product_manager.result_obj;
    
    n_recip.id_html     = r_o.id_html;
    n_recip.image_src   = r_o.image_src;
    n_recip.title       = r_o.title;
    n_recip.text        = $( "text_nrecp" ).value;
    n_recip.ingr        = ingr;
    n_recip.count       = count;
    
    product_manager.messeger.AppendNewRecipt (  ";\n" + JSON.stringify( n_recip ) );
};

RecipsManager.prototype.CreateProdOfRecip = function()
{
    if (this.active_recip === null)
        return false;
    
    var ing_list = [];
    var j;
    
    var icebox_l = product_manager.product_list_in_icebox;
    var ar = this.active_recip;
    
    //выбираем со стола продукты которые есть в рецепте
    for ( var i =0; i < icebox_l.length; i++)
    {
        if( icebox_l[i].shelf == 5)
            for ( j =0; j < ar.ingr.length; j++)
            {
                if ( ar.ingr[j] ==  icebox_l[i].stor_id )
                    ing_list.push ( icebox_l[i] );
            }
    }
    
    // все ли типы игингридиентов есть
    if ( ing_list.length != ar.ingr.length )
        return false;
    
    //смотрим в достаточном ли они количестве
    for ( j = 0; j < ar.ingr.length; j++)
        if ( ar.count[j] > ing_list[j].count )
            return false;
    
    //тратим нужное колво продукта на блюдо
    for ( j = 0; j < ar.ingr.length; j++)
        ing_list[j].count = parseInt( ing_list[j].count ) - parseInt( ar.count[j] );
        
    // удаляем пустые и темы (если колво после приготовления == 0)
    i = 0;
    while ( i < icebox_l.length )
    {
        if( +icebox_l[i].count === 0)
            icebox_l.splice( i, 1 );
        else
            i++;
    }
    
    var new_obj = product_manager.GetProdInStore ( ar.id_html );
    
    product_manager.AddNewProdInIceBox( new_obj, 1 );
    
    product_manager.RePrintProductActiveShelfs();
       
    return true;
};

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
        need_ingr.appendChild( n_prod_l[i].toElement() );
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

Recip.prototype.toElement = function()
{
    var elem = document.createElement( "div" );
    
    elem.setAttribute( "class", "thumbnail prod_item");
    elem.setAttribute( "style", "background-image: url('" + this.image_src + "');" );
    elem.setAttribute( "id", this.id_html +"$r" );
    
    
    var str = "";
    
    str += "<span class='text_prod_item' id='" + this.id_html + "$rs'>";
    str += this.title;
    str += "</span>";
    
    elem.innerHTML = str;
  
    return elem;
}