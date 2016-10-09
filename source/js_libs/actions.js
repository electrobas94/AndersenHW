var product_manager;

function BodyOnLoad()
{
    BodyOnResize();
    product_manager = new ProductManager();
}

function BodyOnResize()
{
    var e1 = document.getElementsByClassName('h_img');
    for(var a =0; a < e1.length; a++)
    {
        e1[a].setAttribute('style','height:' + e1[a].clientWidth+'px');
    }
    
    var e1 = document.getElementsByClassName('h_pan200');
    for(var a =0; a < e1.length; a++)
    {
        e1[a].setAttribute('style','height:' + e1[a].clientWidth*2/3+'px');
    }
}

function allowDrop(ev){
    ev.preventDefault();
}

function drag(ev){
    ev.dataTransfer.setData("obg_id", ev.target.id);
}

function drop(ev)
{
    ev.preventDefault();
    var obg_id = ev.dataTransfer.getData("obg_id");
    
    if( obg_id.toString().split("$").length != 2)
        product_manager.AddProdWindowShow(obg_id);
    else
                product_manager.ChangeShelf(obg_id, product_manager.active_shelf);
}

function RangeMove()
{
    var val_def =  document.getElementById( "count_spinbox" );
    var val_rang = document.getElementById( "count_range" );
    
    val_def.setAttribute( 'value', val_rang.value );
}

function DropInTrash(ev)
{
    ev.preventDefault();
    var obg_id = ev.dataTransfer.getData("obg_id");
    product_manager.DelProdFromShelf(obg_id);
}

function OnDropShelf(ev)
{
    ev.preventDefault();
    var str = ev.target.getAttribute('id');
    str = str[ str.length - 1 ];
    if ( product_manager.active_shelf != +str && +str < 6 && +str > 0 )
    {
        var obg_id = ev.dataTransfer.getData("obg_id");
        product_manager.ChangeShelf(obg_id, +str);
    }
}

function OnItemClick(ev)
{
    var id = ev.target.getAttribute('id');
    
    if( id.split("$").length < 2)
        return;
    
    product_manager.ActivateItemProd( id );
}

function OnRecipClick(ev)
{
    var id = ev.target.getAttribute('id');
    
    product_manager.recip_manager.SelectRecipe ( id );
}

function OnClickCreateRecip()
{
    if( product_manager.recip_manager.CreateRecip() )
    {
        document.getElementById( "res_recip" ).innerHTML = "<span style='color:#65b565'>Создано успешно</span>";
    }
    else
        document.getElementById( "res_recip" ).innerHTML = "<span style='color:#b56565'>На столе мало продуктов</span>";
        
}