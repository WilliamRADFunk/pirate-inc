const CracoLessPlugin = require("craco-less");
const CracoScopedPlugin = require("craco-plugin-scoped-css");

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin
        },
        {
            plugin: CracoScopedPlugin
        }
    ]
}