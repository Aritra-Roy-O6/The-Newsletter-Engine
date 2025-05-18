import React from 'react';
import styled from '@emotion/styled';
import { BlockProps } from '../../types';

const SocialContainer = styled.div`
  padding: 1rem;
  text-align: center;
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const SocialInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  margin-bottom: 0.5rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const socialPlatforms = [
  { id: 'facebook', icon: '📘', label: 'Facebook' },
  { id: 'twitter', icon: '🐦', label: 'Twitter' },
  { id: 'instagram', icon: '📸', label: 'Instagram' },
  { id: 'linkedin', icon: '💼', label: 'LinkedIn' },
  { id: 'youtube', icon: '🎥', label: 'YouTube' },
];

const SocialBlock: React.FC<BlockProps> = ({ id, content, onUpdate }) => {
  const [links, setLinks] = React.useState<Record<string, string>>(
    content ? JSON.parse(content) : {}
  );

  const handleLinkChange = (platform: string, url: string) => {
    const newLinks = { ...links, [platform]: url };
    setLinks(newLinks);
    onUpdate(id, JSON.stringify(newLinks));
  };

  return (
    <SocialContainer>
      <SocialIcons>
        {socialPlatforms.map(platform => (
          <SocialIcon
            key={platform.id}
            href={links[platform.id] || '#'}
            target="_blank"
            rel="noopener noreferrer"
            title={platform.label}
          >
            {platform.icon}
          </SocialIcon>
        ))}
      </SocialIcons>
      <div>
        {socialPlatforms.map(platform => (
          <SocialInput
            key={platform.id}
            type="text"
            value={links[platform.id] || ''}
            onChange={(e) => handleLinkChange(platform.id, e.target.value)}
            placeholder={`Enter ${platform.label} URL...`}
          />
        ))}
      </div>
    </SocialContainer>
  );
};

export default SocialBlock; 