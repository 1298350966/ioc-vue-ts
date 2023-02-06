//module.exports = file => () => import('@/views/' + file + '.vue');
module.exports = (dir, file) => () => import('@/views' + dir + '/' +  file + '.vue');
