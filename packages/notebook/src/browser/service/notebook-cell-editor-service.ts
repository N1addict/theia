// *****************************************************************************
// Copyright (C) 2024 Typefox and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************

import { Emitter, URI } from '@theia/core';
import { injectable } from '@theia/core/shared/inversify';
import { SimpleMonacoEditor } from '@theia/monaco/lib/browser/simple-monaco-editor';

@injectable()
export class NotebookCellEditorService {

    protected onDidChangeCellEditorsEmitter = new Emitter<void>();
    readonly onDidChangeCellEditors = this.onDidChangeCellEditorsEmitter.event;

    protected onDidChangeFocusedCellEditorEmitter = new Emitter<SimpleMonacoEditor | undefined>();
    readonly onDidChangeFocusedCellEditor = this.onDidChangeFocusedCellEditorEmitter.event;

    protected currentActiveCell?: SimpleMonacoEditor;

    protected currentCellEditors: Map<string, SimpleMonacoEditor> = new Map();

    get allCellEditors(): SimpleMonacoEditor[] {
        return Array.from(this.currentCellEditors.values());
    }

    editorCreated(uri: URI, editor: SimpleMonacoEditor): void {
        this.currentCellEditors.set(uri.toString(), editor);
        this.onDidChangeCellEditorsEmitter.fire();
    }

    editorDisposed(uri: URI): void {
        this.currentCellEditors.delete(uri.toString());
        this.onDidChangeCellEditorsEmitter.fire();
    }

    editorFocusChanged(editor?: SimpleMonacoEditor): void {
        this.currentActiveCell = editor;
        this.onDidChangeFocusedCellEditorEmitter.fire(editor);
    }

    getActiveCell(): SimpleMonacoEditor | undefined {
        return this.currentActiveCell;
    }
}