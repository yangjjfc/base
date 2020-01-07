export let id = '';
export const createMountIdAndMount = () => {
    id = 'main-content-' + parseInt(Math.random() * Math.random() * 100000000000);
    $('body').append(`<div id="${id}" class="main-content"></div>`);
};

export const showIsId = () => {
    $('.main-content').hide();
    $('#' + id).show();
};