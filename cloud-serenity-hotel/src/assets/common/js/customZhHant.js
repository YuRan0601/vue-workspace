import { zhHant } from 'vuetify/locale';

const customZhHant = {
    ...zhHant, // 保留官方的繁體中文翻譯
    datePicker: {
        itemsSelected: '{0} 項已選擇',
        range: {
            title: '選擇日期範圍',
            header: '輸入日期範圍',
        },
        title: '選擇日期',
        header: '選擇日期',
        input: {
            placeholder: '輸入日期',
        },
    },
};

export default customZhHant;
