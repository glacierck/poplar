import {AddLabelAction} from "../Action/AddLabel";
import {SoftLine} from "./Element/SoftLine";

export class SelectionHandler {
    static selectLengthLimit = 80;

    static getSelectionInfo() {
        const selection = window.getSelection();
        const startElement = selection.anchorNode.parentNode;
        const endElement = selection.focusNode.parentNode;
        let startSoftLine: SoftLine;
        let endSoftLine: SoftLine;
        let startIndex: number;
        let endIndex: number;
        try {
            startSoftLine = (startElement as any).instance.AnnotatorElement as SoftLine;
            endSoftLine = (endElement as any).instance.AnnotatorElement as SoftLine;
            startIndex = startSoftLine.toGlobalIndex(selection.anchorOffset);
            endIndex = endSoftLine.toGlobalIndex(selection.focusOffset);
        } catch (e) {
            return null;
        }
        if (startIndex > endIndex) {
            [startIndex, endIndex] = [endIndex, startIndex];
        }
        if (endIndex - startIndex >= this.selectLengthLimit) {
            return null;
        }
        while (startSoftLine.ancestor.store.data[startIndex] === ' ') {
            ++startIndex;
        }
        while (startSoftLine.ancestor.store.data[endIndex - 1] === ' ') {
            ++startIndex;
        }
        if (startIndex >= endIndex) {
            return null;
        }
        return {
            startIndexInRaw: startIndex,
            endIndexInRaw: endIndex
        }
    }

    static textSelected() {
        let selectionInfo = SelectionHandler.getSelectionInfo();
        if (selectionInfo) {
            AddLabelAction.emit(selectionInfo.startIndexInRaw, selectionInfo.endIndexInRaw);
        }
        window.getSelection().removeAllRanges();
    }
}