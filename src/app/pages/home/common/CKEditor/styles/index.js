import styled from 'styled-components';

const EditorWrapper = styled.div`
  div {
    &.ck-content {
      border: ${({ valid }) => valid ? '' : '1px solid #F44336!important'};
      height: 280px;
      outline-width: 0;
      border-radius: 6px;
      box-shadow: inset 0 0 3px rgba(104, 105, 105, .3);
      resize: none;
      padding: 5px 10px;
      outline-width: 0;
    }
  }
`;

export default EditorWrapper;
