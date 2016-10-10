/*
 * Основной класс. Управляет списками продуктов на полкахб столе и в магазине
 * Является контейнером для второстипенных классов
 */

function ProductManager()
{

    this.sel_obj = null;
    this.product_list_store = [];
    this.product_list_in_icebox = [];
    
    this.messeger = new Messager();
    
    this.messeger.GetObjectsStore( this.product_list_store );
    this.PrintProductsStore();
    
    this.counter_id = this.product_list_in_icebox.length;
    
    this.active_shelf = -1;
    
    this.recip_manager = new RecipsManager( this.messeger.GetObjectsRecips() );
}

ProductManager.prototype.GetNewId = function()
{
    var str = "$" + this.counter_id + "9";
    this.counter_id++;
    
    return str;
};

ProductManager.prototype.ActivateItemProd = function(id)
{
    var obj = this.SearthProdInStore(id, this.product_list_in_icebox );
    
    if( obj === null )
        return;
    
    $( "pan_head_replist" ).innerHTML = obj.title + " используться в:";
    
    var r_list = this.recip_manager.GetRecips( id.toString().split("$")[0]  );
    var r_list_html = $("rep_list");
    
    r_list_html.innerHTML = "";
    
    for (var i = 0; i < r_list.length; i++)
        r_list_html.innerHTML += r_list[i].toHTML();
};

ProductManager.prototype.ChangeShelf = function( id, num_shelf )
{
    var icebox_l = this.product_list_in_icebox;
    var obj = this.SearthProdInStore(id, icebox_l );
    
    if( obj === null )
        return;
    
    obj.shelf = num_shelf;
    
    // delete duplicates item
    for ( var i = 0; i < icebox_l.length; i++ )
    {
        if( obj.id_html != icebox_l[i].id_html &&
            obj.stor_id == icebox_l[i].stor_id &&
            obj.shelf   == icebox_l[i].shelf)
        {
            obj.count = parseInt( obj.count ) + parseInt( icebox_l[i].count );
            icebox_l.splice(i,1);
        }
    }
    
    this.RePrintProductActiveShelfs();
};

ProductManager.prototype.SelectShelf = function(num)
{
    var str = "";
    
    switch ( num )
    {
        case 1: str = "Верхние полки"; break;
        case 2: str = "Нижние полки"; break;
        case 3: str = "Дверь верхняя"; break;
        case 4: str = "Дверь нижняя"; break; 
    };
    
    $( "pan_hed_shelf" ).innerHTML = str;
    
    this.active_shelf = num;
    this.RePrintProductActiveShelfs();
};

ProductManager.prototype.DelProdFromShelf = function(id)
{
    var icebox_l = this.product_list_in_icebox;
        
    for( var i = 0; i < icebox_l.length; i++ )
        if( icebox_l[i].id_html == id )
        {
            icebox_l.splice( i, 1 );
            break;
        }
    
    this.RePrintProductActiveShelfs();
};

ProductManager.prototype.AddProdOnShelf = function()
{
    var activ_self  = $( "active_shelf" );
    var count       = $( "count_spinbox" ).value;
    var icebox_l    = this.product_list_in_icebox;
    
    for ( var i = 0; i < icebox_l.length; i++ )
    {
        if( icebox_l[i].stor_id == this.sel_obj.id_html &&
            icebox_l[i].shelf   == this.active_shelf )
            {
                icebox_l[i].count = parseInt( icebox_l[i].count ) + parseInt( count );
                
                this.RePrintProductActiveShelfs();
                this.CountDevederHide();
                
                return;
            }
    }
    
    var tmp = new ProductInIcebox( this.sel_obj, this.GetNewId(), count, this.active_shelf);
    
    icebox_l.push(tmp);
    activ_self.innerHTML += tmp.toHTML();
    
    this.CountDevederHide();
};

//Если можно то показываем окно добавление продукта
ProductManager.prototype.AddProdWindowShow = function( id )
{
    var obj = this.SearthProdInStore( id, this.product_list_store );
    
    if( obj === null)
        return;
    
    if( this.active_shelf < 0)
        return;
    
    this.sel_obj = obj; 
    
    this.CountDevederShow( 100, obj.nt );
};

//Показывает окно выбора количества продуктов
ProductManager.prototype.CountDevederShow = function( def, nt )
{
    $( "count_nt" ).innerHTML = nt;
    $( "count_spinbox" ).setAttribute('value', def);
        
    var obj = $( "count_devider" );
    
    var w = Math.round( document.body.clientWidth /2 - ( obj.clientWidth / 2 ) );
    
    var h =  $( "all_container" ).clientHeight;
    h = Math.round ( h/2 - ( obj.clientHeight / 2) );
    
    obj.setAttribute( 'style','top: ' + h + 'px;left: ' + w + 'px;visibility:visible;');
};

ProductManager.prototype.CountDevederHide = function()
{
    $( "count_devider" ).setAttribute('style','visible:hidden');
};

ProductManager.prototype.GetProdInStore = function( id )
{
    return this.SearthProdInStore( id, this.product_list_store );
};

ProductManager.prototype.SearthProdInStore = function( id, list)
{
    for( var i = 0; i < list.length; i++ )
    {
        var tmp = list[i];
        if( tmp.id_html == id )
            return tmp;
    }
    
    return null;
};

ProductManager.prototype.PrintProductsStore = function()
{
    var conteiner = $ ( "store" );
    var stor_l = this.product_list_store;
    
    for( var i = 0; i < stor_l.length; i++)
        conteiner.innerHTML += stor_l[i].toHTML();
};

ProductManager.prototype.RePrintProductActiveShelfs = function()
{
    this.ClearProductOnAllShelf();
    this.PrintProductActiveShelfs();
};

ProductManager.prototype.ClearProductOnAllShelf = function()
{
    $( "active_shelf" ).innerHTML = "";
    $( "shelf_5" ).innerHTML = "";
};

ProductManager.prototype.PrintProductActiveShelfs = function()
{
    var obj = $( "active_shelf" );
    var s_5 = $( "shelf_5" );
    var icebox_l = this.product_list_in_icebox;
    
    for( var i = 0; i < icebox_l.length; i++ )
    {
        if( this.active_shelf == icebox_l[i].shelf )
            obj.innerHTML += icebox_l[i].toHTML();
            
        if ( +icebox_l[i].shelf == 5 )
            s_5.innerHTML += icebox_l[i].toHTML();
    }
};