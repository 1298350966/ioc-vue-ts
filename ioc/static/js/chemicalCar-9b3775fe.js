const A="data:image/png;base64,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";export{A as default};