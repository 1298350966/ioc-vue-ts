module.exports = (dir, file) => require('@/views' + dir + '/' +  file + '.vue').default; // vue-loader at least v13.0.0+
// module.exports = (file) => require('@/views/' +  file + '.vue').default; // vue-loader at least v13.0.0+
