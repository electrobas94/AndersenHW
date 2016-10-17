// Обработка событий и некоторые утилиты

var prod_mng;

var IceBoxM = ( function()
{
    var WindowOnResize = function()
    {
        var obj_l = document.getElementsByClassName( 'h_img' );

        for ( var a = 0; a < obj_l.length; a++ )
            obj_l[a].setAttribute( 'style', 'height:' + obj_l[a].clientWidth + 'px' );
    };

    var SetActionsOnDoc = function()
    {
        window.addEventListener( "resize", WindowOnResize );

        $( "btn_ok" ).addEventListener( "click", function() { product_manager.AddProdOnShelfFromStore(); } );
        $( "btn_cancel" ).addEventListener( "click", function() { product_manager.CountDevederHide(); } );

        $( "count_range" ).addEventListener( "change", RangeMove );

        var shelf_1 = $( "shelf_1" );
        shelf_1.addEventListener( "dragover", allowDrop );
        shelf_1.addEventListener( "click", function() { product_manager.SelectShelf( 1 ); } );
        shelf_1.addEventListener( "drop", OnDropShelf );

        var shelf_2 = $( "shelf_2" );
        shelf_2.addEventListener( "dragover", allowDrop );
        shelf_2.addEventListener( "click", function() { product_manager.SelectShelf( 2 ); } );
        shelf_2.addEventListener( "drop", OnDropShelf );

        var shelf_3 = $( "shelf_3" );
        shelf_3.addEventListener( "dragover", allowDrop );
        shelf_3.addEventListener( "click", function() { product_manager.SelectShelf( 3 ); } );
        shelf_3.addEventListener( "drop", OnDropShelf );

        var shelf_4 = $( "shelf_4" );
        shelf_4.addEventListener( "dragover", allowDrop );
        shelf_4.addEventListener( "click", function() { product_manager.SelectShelf( 4 ); } );
        shelf_4.addEventListener( "drop", OnDropShelf );

        var trash = $( "trash" );
        trash.addEventListener( "dragover", allowDrop );
        trash.addEventListener( "drop", DropInTrash );

        var prod_result = $( "prod_result" );
        prod_result.addEventListener( "dragover", allowDrop );
        prod_result.addEventListener( "drop", DropInResult );

        var trash_2 = $( "trash_2" );
        trash_2.addEventListener( "dragover", allowDrop );
        trash_2.addEventListener( "drop", DropInTrash );

        var shelf_5 = $( "shelf_5" );
        shelf_5.addEventListener( "dragover", allowDrop );
        shelf_5.addEventListener( "drop", OnDropShelf );

        var active_shelf = $( "active_shelf" );
        active_shelf.addEventListener( "dragover", allowDrop );
        active_shelf.addEventListener( "drop", drop );
        active_shelf.addEventListener( "click", OnItemClick );

        $( "create_new_item" ).addEventListener( "click", OnClickCreateProdOfRecip );

        $( "open_edit" ).addEventListener( "click", OpenEditor );
        $( "open_icebox" ).addEventListener( "click", OpenIceBox );

        $( "new_prod" ).addEventListener( "click", function() { product_manager.AddNewProd(); } );
        $( "append_recip" ).addEventListener( "click", function() { product_manager.recip_manager.AddNewRecip(); } );

        $( "rep_list" ).addEventListener( "click", OnRecipClick );
    };

    var OpenIceBox = function()
    {
        $( "icebox" ).setAttribute( "style", "display:block;" );
        $( "editor" ).setAttribute( "style", "display:none;" );
        $( "recipt_block" ).setAttribute( "style", "display:block;" );
        $( "stor_head" ).innerHTML = "Магазин";

        product_manager.SelectShelf( product_manager._prev_active_shelf );

        $( "store" ).innerHTML = "";

        window.onload();
    };

    var OpenEditor = function()
    {
        $( "icebox" ).setAttribute( "style", "display:none;" );
        $( "editor" ).setAttribute( "style", "display:block;" );
        $( "recipt_block" ).setAttribute( "style", "display:none;" );

        $( "pan_hed_shelf" ).innerHTML = "Ингридиенты рецепта <small>(Перетаскиваем сюда)</small>";

        WindowOnResize();

        product_manager._prev_active_shelf = active_shelf;

        product_manager.SelectShelf( 6 );
    };

    var allowDrop = function( ev )
    {
        ev.preventDefault();
    };

    var DragItem = function( ev )
    {
        ev.dataTransfer.setData( "obg_id", ev.target.id );
    };

    var drop = function( ev )
    {
        ev.preventDefault();
        var obg_id = ev.dataTransfer.getData( "obg_id" );

        if ( obg_id.split( '$' ).length == 1 )
            product_manager.AddProdWindowShow( obg_id );
        else
            product_manager.ChangeShelf( obg_id, product_manager.active_shelf );
    };

    var DropInResult = function( ev )
    {
        ev.preventDefault();

        var obg_id = ev.dataTransfer.getData( "obg_id" );
        var obj = product_manager.GetProdInStore( obg_id );

        if ( obj !== null )
        {
            let prod_res = $( "prod_result" );
            
            prod_res.innerHTML = "";
            prod_res.appendChild( obj.toElement() );
            
            product_manager.result_obj = obj;
        }
    };

    var RangeMove = function()
    {
        var val_def = $( "count_spinbox" );
        var val_rang = $( "count_range" );

        val_def.setAttribute( 'value', val_rang.value );
    };

    var DropInTrash = function( ev )
    {
        ev.preventDefault();
        var obg_id = ev.dataTransfer.getData( "obg_id" );
        product_manager.DelProdFromShelf( obg_id );
    };

    var OnDropShelf = function( ev )
    {
        ev.preventDefault();
        var str = ev.target.getAttribute( 'id' );
        str = str[ str.length - 1 ];

        if ( product_manager.active_shelf != +str &&
                +str < 6 &&
                +str > 0 )
        {
            var obg_id = ev.dataTransfer.getData( "obg_id" );
            product_manager.ChangeShelf( obg_id, +str );
        }
    };

    var OnItemClick = function( ev )
    {
        var id = ev.target.getAttribute( 'id' );

        if ( id.split( '$' ).length != 2 )
            return;

        product_manager.ActivateItemProd( id );
    };

    var OnRecipClick = function( ev )
    {
        var id = ev.target.getAttribute( 'id' );

        id = id.split( '$' )[0];

        product_manager.recip_manager.SelectRecipe( id );
    };

    var OnClickCreateProdOfRecip = function()
    {
        if ( product_manager.recip_manager.CreateProdOfRecip() )
            $( "res_recip" ).innerHTML = "<span style='color:#65b565'>Создано успешно</span>";
        else
            $( "res_recip" ).innerHTML = "<span style='color:#b56565'>На столе мало продуктов</span>";

    };

    return {
        Start : function()
        {
            WindowOnResize();
            product_manager = new ProductManager();
            SetActionsOnDoc();
        },
        dragItem : DragItem
    }
} )();

var product_manager;

window.onload = function BodyOnLoad()
{
    IceBoxM.Start();
};

function $( id )
{
    return document.getElementById( id );
}