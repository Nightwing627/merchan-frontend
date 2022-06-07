import React from 'react';
import PropTypes from 'prop-types';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import CKEditor from '@ckeditor/ckeditor5-react';

import EditorWrapper from './styles';

const CKEditorWrapper = (props) => (
  <EditorWrapper valid={props.valid} name={props.name}>
    <CKEditor
      onInit={editor => {
        // Insert the toolbar before the editable area.
        editor.ui.getEditableElement().parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
        );
      }}
      editor={DecoupledEditor}
      {...props}
    />
  </EditorWrapper>
);

CKEditorWrapper.propTypes = {
  valid: PropTypes.bool,
  name: PropTypes.string,
};

export default CKEditorWrapper;
