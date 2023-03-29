import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, message, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { RcFile } from 'antd/lib/upload';
import { UserAPI } from 'apis/user';
import { Image } from 'components/Image';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  src?: string;
  onChangeImage?: (url: string) => void;
  internalProps?: {
    isEdit?: boolean;
    isRect?: boolean;
    isSquare?: boolean;
  };
  textButton?: string;
  isDisabled?: boolean;
  fileSizeLimit?: number;
  bannerRatio?: boolean;
}

export const UploadImage: React.FC<Props> = ({
  isDisabled,
  textButton,
  src,
  onChangeImage,
  internalProps,
  fileSizeLimit,
  bannerRatio,
}) => {
  const { t } = useTranslation();

  const onCustomRequest = useCallback(
    async (options: UploadRequestOption) => {
      const formData = new FormData();
      formData.append('file', options.file);
      try {
        const res = await UserAPI.UPLOAD_AVATAR(formData);
        onChangeImage && onChangeImage(res.url);
        message.destroy();
      } catch (error) {
        message.destroy();
        message.error(t('UPLOADING_ERROR_TEXT'));
      }
    },
    [onChangeImage, t],
  );

  const onCheckFileSize = useCallback(
    (file: RcFile) => {
      if (!fileSizeLimit || file.size / 1024 <= fileSizeLimit) return true;
      message.error(t('FILE_SIZE_LIMIT'));
      return false;
    },
    [fileSizeLimit, t],
  );

  return (
    <div className={internalProps && 'a-uploadavatar'}>
      {internalProps ? (
        <>
          {internalProps.isRect ? (
            <Image src={src} preview={false} width={288} height={162} />
          ) : internalProps.isSquare ? (
            <Image src={src} preview={false} width={220} height={220} />
          ) : (
            <Avatar size={200} src={src} icon={!src && <UserOutlined />} />
          )}
          <ImgCrop
            quality={1}
            aspect={
              bannerRatio
                ? 3431 / 1441
                : (internalProps.isRect && 16 / 9) || (internalProps.isSquare && 1 / 1) || undefined
            }
            shape={internalProps.isRect || internalProps.isSquare ? 'rect' : 'round'}
            modalTitle={t('EDIT_TEXT')}
            modalCancel={t('COMMON_BUTTON_CANCEL')}>
            <Upload
              onChange={() => message.loading({ duration: null, content: t('UPLOADING_IMAGE_TEXT') })}
              accept='image/png, image/jpeg'
              maxCount={1}
              showUploadList={false}
              className='a-upload'
              beforeUpload={onCheckFileSize}
              customRequest={onCustomRequest}>
              {internalProps.isEdit && <EditOutlined style={{ fontSize: 25 }} />}
            </Upload>
          </ImgCrop>
        </>
      ) : (
        <ImgCrop
          quality={1}
          aspect={3431 / 1441}
          shape='rect'
          modalTitle={t('ADD_BANNER_TEXT')}
          modalOk='Ok'
          modalCancel={t('COMMON_BUTTON_CANCEL')}>
          <Upload
            onChange={() => message.loading({ duration: null, content: t('UPLOADING_IMAGE_TEXT') })}
            accept='image/png, image/jpeg'
            maxCount={1}
            showUploadList={false}
            customRequest={onCustomRequest}>
            <Button type='primary' disabled={isDisabled}>
              {textButton}
            </Button>
          </Upload>
        </ImgCrop>
      )}
    </div>
  );
};
