class RenderFormFromJson {
    private idCounter: number = 0;

    constructor(private options: RenderOptions) {}

    formFromJson(formJson) {
        var fields = formJson.fields;
        var html = "";
        Util.foreach(fields, (field, fieldJson) => {
            html += this.fieldFromJson(field, fieldJson) + "\n";
        });

        return html;
    }

    private fieldFromJson(fieldName, fieldJson) {
        var fieldOptions = { "class": "form-control", "supler:fieldType": fieldJson.type, "supler:multiple": fieldJson.multiple };
        var id = this.nextId();

        switch(fieldJson.type) {
            case "string":
                return this.stringFieldFromJson(id, fieldName, fieldJson, fieldOptions);

            case "integer":
                return this.options.renderIntegerField(fieldJson.label, id, fieldName, fieldJson.value, fieldOptions);

            case "subform":
                return this.subformFieldFromJson(id, fieldName, fieldJson);

            default:
                return "";
        }
    }

    private stringFieldFromJson(id, fieldName, fieldJson, fieldOptions) {
        if (fieldJson.possible_values) {
            if (fieldJson.multiple) {
                return "";
            } else {
                return this.options.renderSingleChoiceSelectField(fieldJson.label, id, fieldName, fieldJson.value,
                    fieldJson.possible_values, fieldOptions);
            }
        } else {
            return this.options.renderStringField(fieldJson.label, id, fieldName, fieldJson.value, fieldOptions);
        }
    }

    private subformFieldFromJson(id, fieldName, fieldJson) {
        var html = "";
        html += HtmlUtil.renderTag("fieldset", {"id": id, "name": fieldName }, false);
        html += "\n";
        html += "<legend>" + fieldJson.label + "</legend>\n";

        if (fieldJson.multiple) {
            for (var i in fieldJson.value) {
                html += HtmlUtil.renderTag("div", {
                    "class": "well",
                    "supler:fieldType": "subform",
                    "supler:fieldName": fieldName,
                    "supler:multiple": fieldJson.multiple }, false);
                html += this.formFromJson(fieldJson.value[i]);
                html += "</div>\n";
            }
        } else {

        }

        html += "</fieldset>\n";
        return html;
    }

    private nextId() {
        this.idCounter += 1;
        return "id" + this.idCounter;
    }
}