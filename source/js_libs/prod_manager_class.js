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
}

ProductManager.prototype.ActivateItemProd = function(id)
{
    var obj = this.SearthProdInStore(id, this.product_list_in_icebox );
    
    if( obj === null )
        return;
    
    document.getElementById( "pan_head_replist" ).innerHTML = obj.title + " используться в:";
    
    var r_list = this.recip_manager.GetRecips( id.toString().split("$")[0]  );
    var r_list_html = document.getElementById("rep_list");
    
    r_list_html.innerHTML = "";
    
    for (var i = 0; i < r_list.length; i++)
        r_list_html.innerHTML += r_list[i].toHTML();
};

ProductManager.prototype.ChangeShelf = function( id, num_shelf )
{
    var obj = this.SearthProdInStore(id, this.product_list_in_icebox );
    
    if( obj === null )
        return;
    obj.shelf = num_shelf;
    
    // delete duplicates item
    for ( var i = 0; i < this.product_list_in_icebox.length; i++ )
    {
        if( obj.id_html != this.product_list_in_icebox[i].id_html
           && obj.id_html.split("$")[0] == this.product_list_in_icebox[i].id_html.split("$")[0]
           &&  obj.shelf == this.product_list_in_icebox[i].shelf)
        {
            obj.count = parseInt( obj.count ) + parseInt( this.product_list_in_icebox[i].count );
            this.product_list_in_icebox.splice(i,1);
        }
    }
    
    this.RePrintProductActiveShelfs();
};

ProductManager.prototype.SelectShelf = function(num)
{
    var str ="";
    switch ( num)
    {
        case 1: str = "Верхние полки"; break;
        case 2: str = "Нижние полки"; break;
        case 3: str = "Дверь верхняя"; break;
        case 4: str = "Дверь нижняя"; break; 
    };
    document.getElementById( "pan_hed_shelf" ).innerHTML = str; 
    this.active_shelf = num;
    this.RePrintProductActiveShelfs();
};

ProductManager.prototype.DelProdFromShelf = function(id)
{
    for( var i = 0; i < this.product_list_in_icebox.length; i++ )
    {
        var tmp = this.product_list_in_icebox[i];
        if( tmp.id_html == id )
        {
            this.product_list_in_icebox.splice(i,1);
            break;
        }
    }
    
    this.RePrintProductActiveShelfs();
};

ProductManager.prototype.AddProdOnShelf = function()
{
    var activ_self = document.getElementById( "active_shelf" );
    var count = document.getElementById( "count_spinbox" ).value;
    
    for ( var i = 0; i < this.product_list_in_icebox.length; i++ )
        if( this.product_list_in_icebox[i].id_html.split("$")[0] == this.sel_obj.id_html &&
           this.product_list_in_icebox[i].shelf == this.active_shelf)
            {
                this.product_list_in_icebox[i].count = parseInt (this.product_list_in_icebox[i].count ) + parseInt( count );
                this.RePrintProductActiveShelfs();
                this.CountDevederHide();
                return;
            }
    var tmp = new ProductInIcebox( this.sel_obj, this.GetNewId(), count, this.active_shelf);
    
    this.product_list_in_icebox.push(tmp);
    activ_self.innerHTML += tmp.toHTML();
    
    this.CountDevederHide();
};

ProductManager.prototype.AddProdWindowShow = function(id)
{
    var obj = this.SearthProdInStore(id, this.product_list_store );
    
    if( obj === null)
        return;
    
    if( this.active_shelf < 0)
        return;
    
    this.sel_obj = obj; 
    
    this.CountDevederShow( 100, obj.nt );
};

ProductManager.prototype.CountDevederShow = function(def, nt)
{
    var nt_t =  document.getElementById( "count_nt" );
    var val_def =  document.getElementById( "count_spinbox" );
    
    nt_t.innerHTML = nt;
    val_def.setAttribute('value', def);
        
    var h =  document.getElementById( "all_container" ).clientHeight;
    var obj = document.getElementById ( "count_devider" );
    
    var w = Math.round ( document.body.clientWidth /2 - (obj.clientWidth / 2 ) );
    h = Math.round ( h/2 - (obj.clientHeight / 2) );
    
    obj.setAttribute('style','top: ' + h + 'px;left: ' + w + 'px;visibility:visible;');
};

ProductManager.prototype.CountDevederHide = function()
{
    var obj = document.getElementById ( "count_devider" );
    
    obj.setAttribute('style','visible:hidden');
};

ProductManager.prototype.GetProdInStore = function( id )
{
    return this.SearthProdInStore( id, this.product_list_store );
}

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
    var conteiner = document.getElementById ( "store" );
    
    for( var i = 0; i < this.product_list_store.length; i++)
        conteiner.innerHTML += this.product_list_store[i].toHTML();
};

ProductManager.prototype.RePrintProductActiveShelfs = function()
{
    this.ClearProductOnAllShelf();
    this.PrintProductActiveShelfs();
};

ProductManager.prototype.ClearProductOnAllShelf = function()
{
    var activ_self = document.getElementById( "active_shelf" );
 
    activ_self.innerHTML = "";
    
    document.getElementById( "shelf_5" ).innerHTML = "";
};

ProductManager.prototype.PrintProductActiveShelfs = function()
{
    var obj = document.getElementById( "active_shelf" );
    var s_5 = document.getElementById( "shelf_5" );
    
    for( var i = 0; i < this.product_list_in_icebox.length; i++)
    {
        if( this.active_shelf == this.product_list_in_icebox[i].shelf )
            obj.innerHTML += this.product_list_in_icebox[i].toHTML();
            
        if ( +this.product_list_in_icebox[i].shelf == 5 )
            s_5.innerHTML += this.product_list_in_icebox[i].toHTML();
    }
};