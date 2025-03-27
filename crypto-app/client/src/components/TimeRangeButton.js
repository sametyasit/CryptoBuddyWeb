import styled from 'styled-components';

export const TimeRangeButtons = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
`;

export const TimeRangeButton = styled.button`
  padding: 8px 16px;
  border: 1px solid ${props => props.active ? '#3861FB' : '#e0e0e0'};
  background-color: ${props => props.active ? '#3861FB' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#666'};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? '#3861FB' : '#f5f5f5'};
  }
`; 